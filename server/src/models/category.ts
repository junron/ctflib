import getConnection from "../database/connect";
import {RowDataPacket} from "mysql2";
import {Expose} from "class-transformer";
import {IsDefined} from "class-validator";

export class Category {
  @Expose()
  @IsDefined()
  name: string;
  @Expose()
  @IsDefined()
  icon: string;
  @Expose()
  @IsDefined()
  color: string;
  @Expose()
  light_color: string|null = null;
  @Expose()
  is_major: boolean = false;

  constructor(name: string, icon: string, color: string, light_color: string|null = null, is_major: boolean = false) {
    this.name = name;
    this.icon = icon;
    this.color = color;
    this.light_color = light_color;
    this.is_major = is_major;
  }

  async create() {
    const connection = await getConnection();
    const query = `insert into category
                       (name, icon, color, light_color, is_major)
                   values (?, ?, ?, ?, ?)`;
    const values = [this.name, this.icon, this.color, this.light_color, this.is_major];
    await connection.execute(query, values);
  }

  static async getAll() {
    const connection = await getConnection();
    const query = `select *
                   from category`;
    const [rows] = await connection.execute<RowDataPacket[]>(query);
    return rows as Category[];
  }
}
