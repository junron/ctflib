import {RowDataPacket} from "mysql2";
import {Exclude, Expose, plainToClass, plainToInstance} from "class-transformer";
import {IsDate, IsNumber, IsString} from "class-validator";
import {Connection} from "mysql2/promise";
import getConnection from "../../database/connect";

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
  organizer!: string;

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

}