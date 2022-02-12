import getConnection from "./connect";
import * as fs from "fs";

function getMigrations(): Promise<string[]> {
  //  List files in the migrations/progress directory asynchronously
  return new Promise((resolve, reject) => {
    fs.readdir("./migrations/progress", (err, files) => {
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
  await connection.execute(`create table if not exists migration_version
                            (
                                version int not null
                            );`);
  const [rows, fields] = await connection.execute("select version from migration_version limit 1");
  const version = rows.length == 1 ? rows[0].version : -1;
  const migrations = (await getMigrations()).sort((a: string, b: string) => a.localeCompare(b));
  // Non-atomic migrations but it's probably fine
  // If migration fails run regress
  try {
    for (const migration of migrations.slice(version + 1)) {
      console.log("Running migration " + migration);
      const sql = fs.readFileSync(`./migrations/progress/${migration}`, "utf8");
      const queries = sql.split(";").map(a => a.trim()).filter(a => a.length > 0);
      for (const query of queries) {
        await connection.query(query);
      }
    }
    await connection.query("delete from migration_version");
    await connection.query("insert into migration_version (version) values (?)", [migrations.length - 1]);
    console.log("Migration complete");
  } catch (e) {
    console.log("Migration failed: " + e);
    process.exit(-1);
  }

}
