import * as fs from "fs";

interface Config {
  port: number;
  mysql_password: string,
  secret: string,
  registration_secret: string,
  client_id: string,
}

const config: Config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));
export default config;
