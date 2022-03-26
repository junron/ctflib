import {Exclude, Expose, plainToInstance} from "class-transformer";
import {IsBoolean, IsNumber, IsOptional, IsString} from "class-validator";

import getConnection from "../database/connect";
import {RowDataPacket} from "mysql2";

@Exclude()
export class Writeup {
  @Expose()
  @IsNumber()
  writeup_id: number = -1;
  @Expose()
  @IsNumber()
  challenge_id: number = -1;
  @Expose()
  @IsString()
  poster_username!: string;
  @Expose()
  @IsBoolean()
  is_private: boolean = true;
  @Expose()
  @IsOptional()
  @IsString()
  url: string | null = null;
  @Expose()
  @IsOptional()
  @IsString()
  body: string | null = null;

  static async getWriteupByID(id: number, auth: boolean): Promise<Writeup> {
    const connection = await getConnection();
    const [writeups] = await connection.query<RowDataPacket[]>(
      `SELECT writeup_id, challenge_id, poster_username, is_private, body, url
       FROM writeup
                left join external_writeup ew on writeup.writeup_id = ew.external_writeup_id
                left join internal_writeup iw on writeup.writeup_id = iw.internal_writeup_id
       where writeup.writeup_id = ?
           and is_private = FALSE
          or ? = TRUE`,
      [id, auth]);
    if (writeups.length === 0) {
      throw new Error("Writeup not found");
    }
    return plainToInstance(Writeup, writeups[0], {exposeDefaultValues: true});
  }

  async createWithTransaction() {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await connection.execute<RowDataPacket[]>(
        `INSERT INTO writeup (challenge_id, poster_username, is_private)
         VALUES (?, ?, ?)`,
        [this.challenge_id, this.poster_username, this.is_private]);
      const [lastID] = await connection.execute<RowDataPacket[]>("SELECT LAST_INSERT_ID() as id");
      this.writeup_id = lastID[0].id;
      if (this.url) {
        await connection.query(
          `INSERT INTO external_writeup (external_writeup_id, url)
           VALUES (?, ?)`,
          [this.writeup_id, this.url]);
      } else if (this.body) {
        await connection.query(
          `INSERT INTO internal_writeup (internal_writeup_id, body)
           VALUES (?, ?)`,
          [this.writeup_id, this.body]);
      }
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }
}
