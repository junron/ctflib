import getConnection from "../database/connect";
import {RowDataPacket} from "mysql2";
import {Expose, Transform} from "class-transformer";
import {IsBoolean, IsString, ValidateIf} from "class-validator";

export class Category {
  @Expose()
  @IsString()
  name: string;
  @Expose()
  @IsString()
  icon: string;
  @Expose()
  @IsString()
  color: string;
  @Expose()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  light_color: string | null = null;
  @Expose()
  @IsBoolean()
  @Transform(({ value }) => value == true)
  is_major: boolean = false;

  constructor(name: string, icon: string, color: string, light_color: string | null = null, is_major: boolean = false) {
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
