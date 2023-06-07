import {Exclude, Expose, plainToInstance, Transform} from "class-transformer";
import {IsBoolean, IsNumber, IsOptional, IsString} from "class-validator";

import getConnection from "../database/connect";
import {RowDataPacket} from "mysql2";
import {ExportedWriteup} from "../types/exported-writeup";
import {slugify} from "../util";

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

  static async getWriteupByID(id: number, auth: boolean): Promise<Writeup | null> {
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
    const queryString = `select c.name,
                                writeup_id,
                                c.challenge_id,
                                ce.ctf_name,
                                writeup.poster_username,
                                c.category_name,
                                c.event_id,
                                iw.body
                         from writeup
                                  inner join internal_writeup iw on writeup.writeup_id = iw.internal_writeup_id
                                  inner join challenge c on writeup.challenge_id = c.challenge_id
                                  inner join ctf_event ce on c.event_id = ce.event_id
                         where (writeup.is_private = FALSE or ? = TRUE);`;
    const [rows] = await connection.execute<RowDataPacket[]>(queryString,
      [auth]);
    const challengeIDs = rows.map(row => row.challenge_id);
    if (challengeIDs.length === 0) {
      return [];
    }
    const [tags] = await connection.query<RowDataPacket[]>(
      `SELECT challenge_id, tag_name
       FROM challenge_tag
       where challenge_tag.challenge_id IN (?)`, [challengeIDs]);
    return rows.map(row => {
      return ([{
        writeup_id: row.writeup_id,
        name: row.name,
        poster_username: row.poster_username,
        ctf_name: row.ctf_name,
        event_id: row.event_id,
        challenge_id: row.challenge_id,
        category_name: row.category_name,
        tags: tags.filter(tag => tag.challenge_id === row.challenge_id)
          .map(tag => tag.tag_name)
      }, row.body]);
    }).filter(writeup => this.calculate_score(writeup[0], query, writeup[1]) > 0)
      .sort((a, b) => this.calculate_score(b[0], query, b[1]) - this.calculate_score(a[0], query, a[1]))
      .map(a => a[0]);
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


  static async exportWriteups(): Promise<ExportedWriteup[]> {
    const connection = await getConnection();
    const [writeups] = await connection.query<RowDataPacket[]>(`
        SELECT c.category_name,
               c.description,
               c.points,
               c.name,
               ce.ctf_name,
               ce.start_date,
               body,
               c.challenge_id
        FROM writeup
                 inner join internal_writeup iw on writeup.writeup_id = iw.internal_writeup_id
                 inner join challenge c on writeup.challenge_id = c.challenge_id
                 inner join ctf_event ce on c.event_id = ce.event_id
        where is_private = false`);
    const [challengeFiles] = await connection.query<RowDataPacket[]>(`
        select cf.challenge_id, cf.file_id, cf.file_name
        from challenge
                 inner join challenge_file cf on challenge.challenge_id = cf.challenge_id
        where cf.challenge_id in (?)`, [writeups.map(a => a.challenge_id)]);

    const groupedByCat = writeups.reduce((acc, curr) => {
      const cat = curr.category_name.toLowerCase();
      if (acc.has(cat)) {
        acc.get(cat)?.push(curr);
      } else {
        acc.set(cat, [curr]);
      }
      return acc;
    }, new Map<string, RowDataPacket[]>());


    const categoryFiles = Array.from(groupedByCat.entries()).map(([key, value]) => {
      return {
        markdown: `---
layout: home

title: ${key}

hero:
  name: ${key}
  tagline: "Here's some of my ${key} writeups:"

features:
` + value.reverse().map(writeup => {
          const cleanedDescription = writeup.description.replace(/nc .* \d{2,5}/g, "")
            .replaceAll("\n", " ")
            .replaceAll("\r", "")
            .replaceAll("`", "")
            .replaceAll('"', '\\"');
          return `
  - title: "${writeup.name.replaceAll('"', '\\"')}"
    details: "${cleanedDescription}"
    link: /writeups/${key}/${slugify(writeup.name)}.html
    linkText: Read writeup`;
        }).join("\n"),
        path: `/${key}.md`
      };
    });

    return categoryFiles.concat(writeups.map(writeup => {
      const slug = slugify(writeup.name);
      const files = challengeFiles.filter(file => file.challenge_id == writeup.challenge_id);
      const filesMd = files.length ? "Challenge files: " + files.map(
        file => `[${file.file_name}](https://api.ctflib.junron.dev/files/${file.file_id})`
      ).join(" ") : "";
      return {
        path: `/${writeup.category_name.toLowerCase()}/${slug}.md`,
        markdown: `
        # ${writeup.name}
        In ${writeup.ctf_name} ${new Date(writeup.start_date).getFullYear()}, ${writeup.points} points  
        ${writeup.description.length ? ">" : ""} ${writeup.description.split("\n").join("\n> ")}   
        
        ${filesMd}
        \n`.split("\n").map(a => a.trim()).join("\n") + writeup.body
          .replaceAll("```c++", "```cpp")
          .replaceAll("```assembly", "```asm")
          .replaceAll("```xml-dtd", "```xml")
      };
    }));
  }

  private static calculate_score(writeup: WriteupSearchResult, search: string, body: string) {
    search = search.toLowerCase();
    let score = 0;
    if (search == writeup.category_name.toLowerCase() || search.includes(writeup.category_name.toLowerCase())) {
      score += 10;
    }
    for (const tag of writeup.tags) {
      if (search.includes(tag.toLowerCase())) {
        score += 3;
      }
    }
    if (writeup.name.includes(search)) {
      score += 5;
    }
    if (body.includes(search)) {
      score += 1;
    }
    return score;
  }
}
