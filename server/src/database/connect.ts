import {Connection, createConnection} from 'mysql2/promise';
import config from "../config";

let connection: Connection;

export default async function getConnection(): Promise<Connection> {
  const closed = await new Promise(resolve => {
    if (!connection) {
      resolve(true);
    } else {
      connection.ping().catch(() => resolve(true)).then(() => resolve(false));
    }
  });
  if (closed) {
    console.log("new connection");
    connection = await createConnection({
      host: 'localhost',
      user: 'ctflib',
      password: config.mysql_password,
      database: 'ctflib',
      multipleStatements: true
    });
  }
  return connection;
};
