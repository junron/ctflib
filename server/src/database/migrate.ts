import getConnection from "./connect";
import * as fs from "fs";
import {RowDataPacket} from "mysql2";

function getMigrations(): Promise<string[]> {
  //  List files in the migrations/progress directory asynchronously
  return new Promise((resolve, reject) => {
    fs.readdir("./migrations/", (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

export async function init() {
  const connection = await getConnection();
  await connection.execute(`create table if not exists migration_version(version int not null default -1);`);
  const [rows, fields] = await connection.execute<RowDataPacket[]>("select version from migration_version limit 1");
  const version = rows.length == 1 ? rows[0].version : -1;
  if(version == -1) {
    const [rows, fields] = await connection.execute<RowDataPacket[]>(`show tables like 'challenge'`);
    // Incompatible migration, reset database
    if(rows.length > 0){
      console.log("Resetting database");
      await connection.execute(`drop database ctflib;`);
      await connection.execute(`create database ctflib;`);
      await connection.execute(`use ctflib;`);
    }
  }
  const migrations = (await getMigrations()).sort((a: string, b: string) => a.localeCompare(b));
  // Non-atomic migrations but it's probably fine
  // If migration fails run regress
  try {
    for (const migration of migrations.slice(version + 1)) {
      console.log("Running migration " + migration);
      const sql = fs.readFileSync(`./migrations/${migration}`, "utf8");
      // const queries = sql.split(";\n").map(a => a.trim()).filter(a => a.length > 0);
      // for (const query of queries) {
        await connection.query(sql);
      // }
    }
    await connection.query("delete from migration_version");
    await connection.query("insert into migration_version (version) values (?)", [migrations.length - 1]);
    console.log("Migration complete");
  } catch (e) {
    console.log("Migration failed: " + e);
    process.exit(-1);
  }

}
