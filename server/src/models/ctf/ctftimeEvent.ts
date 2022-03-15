import {RowDataPacket} from "mysql2";
import {Exclude, Expose, plainToInstance} from "class-transformer";
import {IsNumber, IsOptional, IsString} from "class-validator";
import {Connection} from "mysql2/promise";
import getConnection from "../../database/connect";
import {CTF} from "./ctf";

@Exclude()
export class CTFTimeEvent extends CTF {
  @Expose()
  @IsNumber()
  ctftime_id: number = -1;
  @Expose()
  @IsNumber()
  @IsOptional()
  winner_score?: number;
  @Expose()
  @IsNumber()
  @IsOptional()
  num_teams?: number;
  @Expose()
  @IsNumber()
  @IsOptional()
  score?: number;
  @Expose()
  @IsNumber()
  @IsOptional()
  ranking?: number;
  @Expose()
  @IsNumber()
  @IsOptional()
  weight?: number;
  @Expose()
  @IsNumber()
  @IsOptional()
  rating_points?: number;
  @Expose()
  @IsString()
  image_url!: string;

  static async getCTFTimeEvents(): Promise<CTFTimeEvent[]> {
    const connection: Connection = await getConnection();
    const [rows]: [RowDataPacket[], any] = await connection.execute(
      `SELECT *
       FROM ctf_event
                inner join ctf_series cs on ctf_event.ctf_name = cs.name
                inner join ctftime_event ce on ctf_event.event_id = ce.event_id`);
    return plainToInstance(CTFTimeEvent, rows, {exposeDefaultValues: true});
  }

  static async getCTFTimeEventByEventId(id: number): Promise<CTFTimeEvent> {
    const connection: Connection = await getConnection();
    const [rows]: [RowDataPacket[], any] = await connection.execute(
      `SELECT *
       FROM ctf_event
                inner join ctf_series cs on ctf_event.ctf_name = cs.name
                inner join ctftime_event ce on ctf_event.event_id = ce.event_id
       where ctf_event.event_id = ?`, [id]);
    return plainToInstance(CTFTimeEvent, rows[0] as CTFTimeEvent, {exposeDefaultValues: true});
  }
}
