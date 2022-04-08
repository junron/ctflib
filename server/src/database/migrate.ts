import getConnection from "./connect";
import * as fs from "fs/promises";
import {RowDataPacket} from "mysql2";
import {Connection} from "mysql2/promise";
import {safeUnlink} from "../util";
import * as path from "path";

function getMigrations(): Promise<string[]> {
  return fs.readdir("./migrations/");
}

async function pruneDeletedFiles(connection: Connection) {
  const [files, _] = await connection.execute<RowDataPacket[]>("select file_path from challenge_file");
  for (const file of await fs.readdir("./data/uploads")) {
    if (!files.find(f => path.resolve(f.file_path) === path.resolve(`./data/uploads/${file}`))) {
      await safeUnlink(`./data/uploads/${file}`);
      console.log(`Deleted ./data/uploads/${file}`)
    }
  }
}

export async function init() {
  const connection = await getConnection();
  await connection.execute(`create table if not exists migration_version
                            (
                                version int not null default -1
                            );`);
  const [rows, fields] = await connection.execute<RowDataPacket[]>("select version from migration_version limit 1");
  const version = rows.length == 1 ? rows[0].version : -1;
  if (version == -1) {
    const [rows, fields] = await connection.execute<RowDataPacket[]>(`show tables like 'challenge'`);
    // Incompatible migration, reset database
    if (rows.length > 0) {
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
      const sql = await fs.readFile(`./migrations/${migration}`, "utf8");
      // const queries = sql.split(";\n").map(a => a.trim()).filter(a => a.length > 0);
      // for (const query of queries) {
      await connection.query(sql);
      // }
    }
    await connection.query("delete from migration_version");
    await connection.query("insert into migration_version (version) values (?)", [migrations.length - 1]);
    await pruneDeletedFiles(connection);
    console.log("Migration complete");
  } catch (e) {
    console.log("Migration failed: " + e);
    process.exit(-1);
  }

}
