import {verify} from "../auth/util";
import * as jwt from "jsonwebtoken";
import config from "../config";
import getConnection from "../database/connect";
import {RowDataPacket} from "mysql2";

export class User {
  username: string;
  email: string;
  github_username: string;
  password_hash: string;

  constructor(username: string, email: string, github_username: string, password_hash: string) {
    this.username = username;
    this.email = email;
    this.github_username = github_username;
    this.password_hash = password_hash;
  }

  login(password: string): boolean {
    return verify(password, this.password_hash);
  }

  getJWT(): string {
    return jwt.sign({
      username: this.username,
      email: this.email,
      github_username: this.github_username
    }, config.secret);
  }

  withoutHash(): User {
    return new User(this.username, this.email, this.github_username, "redacted");
  }

  async create() {
    const connection = await getConnection();
    await connection.execute(
      "INSERT INTO user (username, email, github_username, password_hash) VALUES (?, ?, ?, ?)",
      [this.username, this.email, this.github_username, this.password_hash]);
  }

  static async getByUsername(username: string) {
    const connection = await getConnection();
    const [rows, _] = await connection.execute("SELECT * FROM user WHERE username = ?", [username]);
    const user = (rows as RowDataPacket)[0];
    if (!user) return null;
    return this.fromJson(user);
  }

  static fromJson(json: any): User {
    return new User(
      json.username,
      json.email,
      json.github_username,
      json.password_hash
    );
  }
}
