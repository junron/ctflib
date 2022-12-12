import {Exclude, Expose, plainToInstance, Transform} from "class-transformer";
import {IsBoolean, IsNumber, IsOptional, IsString} from "class-validator";

import getConnection from "../database/connect";
import {RowDataPacket} from "mysql2";

export type WriteupSearchResult = {
  writeup_id: number;
  name: string;
  category_name: string;
  poster_username: string;
  ctf_name: string;
  challenge_id: number;
  event_id: number;
  tags: string[];
}

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
  @Transform(({value}) => value == true)
  is_private: boolean = true;
  @Expose()
  @IsOptional()
  @IsString()
  url: string | null = null;
  @Expose()
  @IsOptional()
  @IsString()
  body: string | null = null;

  static async getWriteupByID(id: number, auth: boolean): Promise<Writeup|null> {
    const connection = await getConnection();
    const [writeups] = await connection.query<RowDataPacket[]>(
      `SELECT writeup_id, challenge_id, poster_username, is_private, body, url
       FROM writeup
                left join external_writeup ew on writeup.writeup_id = ew.external_writeup_id
                left join internal_writeup iw on writeup.writeup_id = iw.internal_writeup_id
       where writeup.writeup_id = ?
         and (is_private = FALSE
           or ? = TRUE)`,
      [id, auth]);
    if (writeups.length === 0) {
      return null;
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

  static async search(query: string, auth: boolean): Promise<WriteupSearchResult[]> {
    const connection = await getConnection();
    // Only internal writeups are searchable
    const queryString = `
        with writeups as (
            select c.name,
                   writeup_id,
                   c.challenge_id,
                   ce.ctf_name,
                   writeup.poster_username,
                   c.category_name,
                   c.event_id,
                   ct.tag_name,
                   calculate_score(c.name, iw.body, '', '', tag_name, category_name, ?) as _score
            from writeup
                     inner join internal_writeup iw on writeup.writeup_id = iw.internal_writeup_id
                     inner join challenge c on writeup.challenge_id = c.challenge_id
                     left join challenge_tag ct on c.challenge_id = ct.challenge_id
                     inner join ctf_event ce on c.event_id = ce.event_id
            where (writeup.is_private = FALSE or ? = TRUE)
        )
        select writeups.*,
               _score + (
                            select count(*)
                            from writeups w
                            where ? like concat('%', w.tag_name, '%')
                              and w.writeup_id = writeups.writeup_id
                        ) * 2
                   as score
        from writeups
        where _score >= all (select _score from writeups w where w.writeup_id = writeups.writeup_id)
        group by writeup_id
        having score > 0
        order by score desc;`;
    const [rows] = await connection.execute<RowDataPacket[]>(queryString,
      [query, auth, query]);
    const challengeIDs = rows.map(row => row.challenge_id);
    if (challengeIDs.length === 0) {
      return [];
    }
    const [tags] = await connection.query<RowDataPacket[]>(
      `SELECT challenge_id, tag_name
       FROM challenge_tag
       where challenge_tag.challenge_id IN (?)`, [challengeIDs]);
    return rows.map(row => {
      return ({
        writeup_id: row.writeup_id,
        name: row.name,
        poster_username: row.poster_username,
        ctf_name: row.ctf_name,
        event_id: row.event_id,
        challenge_id: row.challenge_id,
        category_name: row.category_name,
        tags: tags.filter(tag => tag.challenge_id === row.challenge_id)
          .map(tag => tag.tag_name)
      });
    });
  }

  async deleteWriteup() {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await connection.query(
        `DELETE
         FROM internal_writeup
         WHERE internal_writeup_id = ?`,
        [this.writeup_id]);
      await connection.query(
        `DELETE
         FROM external_writeup
         WHERE external_writeup_id = ?`,
        [this.writeup_id]);
      await connection.query(
        `DELETE
         FROM writeup
         WHERE writeup_id = ?`,
        [this.writeup_id]);
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }

  async editWriteup(newWriteup: Writeup) {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await connection.query("UPDATE writeup SET is_private = ? WHERE writeup_id = ?",
        [newWriteup.is_private, this.writeup_id]);
      if (newWriteup.url) {
        await connection.query("UPDATE external_writeup SET url = ? WHERE external_writeup_id = ?",
          [newWriteup.url, this.writeup_id]);
      } else if (newWriteup.body) {
        await connection.query("UPDATE internal_writeup SET body = ? WHERE internal_writeup_id = ?",
          [newWriteup.body, this.writeup_id]);
      }
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }
}
