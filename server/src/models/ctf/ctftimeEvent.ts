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

  constructor(ctf_name: string,
              start_date: Date,
              end_date: Date,
              website: string,
              organizer: string,
              ctftime_id: number,
              winner_score: number|undefined,
              num_teams: number|undefined,
              score: number|undefined,
              ranking: number|undefined,
              weight: number|undefined,
              image_url: string) {
    super(ctf_name, start_date, end_date, website, organizer);
    this.ctftime_id = ctftime_id;
    this.winner_score = winner_score;
    this.num_teams = num_teams;
    this.score = score;
    this.ranking = ranking;
    this.weight = weight;
    this.image_url = image_url;
  }

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

  async create() {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await super.create(connection);
      await connection.execute(`INSERT INTO ctftime_event (event_id, ctftime_id, winner_score, num_teams, score,
                                                           ranking, weight,
                                                           image_url)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
        this.event_id, this.ctftime_id, this.winner_score, this.num_teams, this.score, this.ranking, this.weight, this.image_url
      ].map(value => value === undefined ? null : value));
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }

  async editCTFTimeEvent(newCTFTimeEvent: CTFTimeEvent): Promise<void> {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await this.editCTF(newCTFTimeEvent, connection);
      await connection.query(
        `UPDATE ctftime_event
         SET winner_score = ?,
             num_teams    = ?,
             score        = ?,
             ranking      = ?,
             weight       = ?,
             image_url    = ?
         WHERE event_id = ?`,
        [
          newCTFTimeEvent.winner_score,
          newCTFTimeEvent.num_teams,
          newCTFTimeEvent.score,
          newCTFTimeEvent.ranking,
          newCTFTimeEvent.weight,
          newCTFTimeEvent.image_url,
          newCTFTimeEvent.event_id
        ].map(value => value === undefined ? null : value));
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }
}
