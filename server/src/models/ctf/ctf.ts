import {RowDataPacket} from "mysql2";
import {Exclude, Expose, plainToInstance} from "class-transformer";
import {IsDate, IsNumber, IsString} from "class-validator";
import {Connection} from "mysql2/promise";
import getConnection from "../../database/connect";
import {Challenge} from "../challenge/challenge";

export type CTFSeries = { name: string, organizer: string }

@Exclude()
export class CTF {
  @Expose()
  @IsNumber()
  event_id: number = -1;
  @Expose()
  @IsString()
  ctf_name!: string;
  @Expose()
  @IsDate()
  start_date!: Date;
  @Expose()
  @IsDate()
  end_date!: Date;
  @Expose()
  @IsString()
  website!: string;
  @Expose()
  @IsString()
  organizer: string = "";

  static async getCTFs(includeCTFTime: boolean): Promise<CTF[]> {
    const connection: Connection = await getConnection();
    let query = "SELECT * FROM ctf_event inner join ctf_series cs on ctf_event.ctf_name = cs.name";
    if (!includeCTFTime) {
      query += " where ctf_event.event_id not in (select event_id from ctftime_event)";
    }
    const [rows]: [RowDataPacket[], any] = await connection.execute(query);
    return plainToInstance(CTF, rows, {exposeDefaultValues: true});
  }

  static async getCTFById(id: number): Promise<CTF> {
    const connection: Connection = await getConnection();
    const [rows]: [RowDataPacket[], any] = await connection.execute(
      `SELECT *
       FROM ctf_event
                inner join ctf_series cs on ctf_event.ctf_name = cs.name
       where event_id = ?`, [id]);
    return plainToInstance(CTF, rows[0] as CTF, {exposeDefaultValues: true});
  }

  static async getNames(): Promise<CTFSeries[]> {
    const connection: Connection = await getConnection();
    const [rows]: [RowDataPacket[], any] = await connection.execute(
      `SELECT name, organizer
       FROM ctf_series`);
    return rows as CTFSeries[];
  }

  async getChallenges(): Promise<Challenge[]> {
    const connection: Connection = await getConnection();
    const [rows]: [RowDataPacket[], any] = await connection.execute(
      `SELECT challenge_id,
              event_id,
              category_name,
              name,
              description,
              points
       from challenge
       where event_id = ?`, [this.event_id]);
    return plainToInstance(Challenge, rows, {exposeDefaultValues: true});
  }

  async create(_connection?: Connection) {
    const connection = _connection ?? await getConnection();
    await connection.beginTransaction();
    try {
      const [orgs, _] = await connection.execute<RowDataPacket[]>(
        `SELECT organizer
         FROM ctf_series
         where name = ?`, [this.ctf_name]);

      if (orgs.length === 0) {
        // CTF series does not exist yet
        if (this.organizer && this.organizer.length) {
          await connection.execute(
            "insert into ctf_series (name, organizer) values (?, ?)",
            [this.ctf_name, this.organizer]);
        }
      } else {
        this.organizer = orgs[0].organizer;
      }

      await connection.execute(
        "insert into ctf_event (ctf_name, start_date, end_date, website) values (?, ?, ?, ?)",
        [this.ctf_name, this.start_date, this.end_date, this.website]);
      const [lastID] = await connection.execute<RowDataPacket[]>("SELECT LAST_INSERT_ID() as id");
      this.event_id = lastID[0].id;
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }

  async editCTF(newCTF: CTF, _connection?: Connection) {
    const connection = _connection ?? await getConnection();
    await connection.execute(
      "update ctf_event set start_date = ?, end_date = ?, website = ? where event_id = ?",
      [newCTF.start_date, newCTF.end_date, newCTF.website, this.event_id]);
  }
}
