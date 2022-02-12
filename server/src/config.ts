import * as fs from "fs";

interface Config {
  port: number;
  mysql_password: string
}

const config: Config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));
export default config;
