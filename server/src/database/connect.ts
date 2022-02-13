import {Connection, createConnection} from 'mysql2/promise';
import config from "../config";

let connection: any;


export default async function getConnection(): Promise<Connection> {
  if (connection) return connection;
  connection = await createConnection({
    host: 'localhost',
    user: 'ctflib',
    password: config.mysql_password,
    database: 'ctflib',
    multipleStatements: true
  });
  return connection;
};
