import {Post} from "./post";
import {Expose, plainToInstance} from "class-transformer";
import {IsNumber, IsOptional, IsString} from "class-validator";
import getConnection from "../database/connect";
import {RowDataPacket} from "mysql2";

export class Guide extends Post {
  @Expose()
  @IsString()
  description: string

  @Expose()
  @IsString()
  body: string

  @Expose()
  @IsNumber()
  @IsOptional()
  series_id: number | null = null

  @Expose()
  @IsString()
  @IsOptional()
  series_name: string | null = null

  @Expose()
  @IsNumber()
  @IsOptional()
  prev: number | null = null

  @Expose()
  @IsNumber()
  @IsOptional()
  next: number | null = null

  constructor(poster_username: string,
              category: string,
              title: string,
              body: string,
              description: string,
              series_id: number | null = null,
              series_name: string | null = null,
              is_private: boolean = true,
              tags: string[] = [],
  ) {
    super(poster_username, category, title, is_private, tags);
    this.body = body;
    this.description = description;
    this.series_id = series_id;
    this.series_name = series_name;
  }


  async create() {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await super.create(connection);
      if (this.series_id) {
        // Has series and series already exists
        const [cnt] = await connection.execute<RowDataPacket[]>(
          `SELECT count(*) as cnt
           FROM guide
           WHERE series_id = ?`,
          [this.series_id]
        );
        console.log(this.series_id, cnt);
        await connection.execute(`INSERT INTO guide (guide_id, description, body, series_id, guide_number)
                                  VALUES (?, ?, ?, ?, ?)`,
          [this.post_id, this.description, this.body, this.series_id, cnt[0].cnt + 1]);
      } else if (this.series_name) {
        // New series
        await connection.execute(`INSERT INTO series (title)
                                  VALUES (?)`,
          [this.series_name]);
        const [lastID] = await connection.execute<RowDataPacket[]>("SELECT LAST_INSERT_ID() as id");
        this.series_id = lastID[0].id;
        await connection.execute(`INSERT INTO guide (guide_id, description, body, series_id, guide_number)
                                  VALUES (?, ?, ?, ?, ?)`,
          [this.post_id, this.description, this.body, this.series_id, 1]);
      } else {
        // No series
        await connection.execute(`INSERT INTO guide (guide_id, description, body)
                                  VALUES (?, ?, ?)`,
          [this.post_id, this.description, this.body]);
      }
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }

  static async getGuideById(post_id: number, auth: boolean) {
    const connection = await getConnection();
    const [result] = await connection.execute<RowDataPacket[]>(
      `SELECT post.*, description, body, g.series_id, guide_number, s.title as series_name
       FROM post
                inner join guide g on post.post_id = g.guide_id
                left join series s on g.series_id = s.series_id
       WHERE post_id = ?
         AND (is_private = false
           OR ? = true)`, [post_id, auth]);
    if (result.length === 1) {
      const guide = (await Post.getTags(result as Guide[]))[0];
      if (guide.series_id) {
        const [res] = await connection.execute<RowDataPacket[]>(
          `with series_posts as (SELECT post_id, guide_number
                                 FROM post
                                          inner join guide g on post.post_id = g.guide_id
                                          left join series s on g.series_id = s.series_id
                                 WHERE g.series_id = ?
                                   AND (is_private = false
                                     OR ? = true))
           select (select max(post_id) from series_posts where guide_number < ?) as prev,
                  (select min(post_id) from series_posts where guide_number > ?) as next
          `, [guide.series_id, auth, result[0].guide_number, result[0].guide_number]);
        guide.prev = res[0].prev;
        guide.next = res[0].next;
      }
      return plainToInstance(Guide, guide, {exposeDefaultValues: true});
    }
    return null;
  }

  static async search(query: string, auth: boolean) {
    const connection = await getConnection();
    const queryString = `
        with guides as (SELECT post.*,
                               description,
                               body,
                               g.series_id,
                               guide_number,
                               post_tag.tag_name,
                               s.title                                as series_name,
                               calculate_score(post.title, g.body, g.description, s.title, tag_name,
                                               post.post_category, ?) as _score
                        FROM post
                                 inner join guide g on post.post_id = g.guide_id
                                 left join series s on g.series_id = s.series_id
                                 left join post_tag on post_tag.post_id = post.post_id
                        WHERE (is_private = false OR ? = true)
        )
        select guides.*,
               _score + (
                            select count(*)
                            from guides p
                            where ? like concat('%', p.tag_name, '%')
                              and p.post_id = guides.post_id
                        ) * 3 # 3 points for every tag contained in the query text
                   as score
        from guides
             # Only obtain the maximum score
        where _score >= all (select _score from guides g where g.post_id = guides.post_id)
        group by post_id
        having score > 0
        order by score desc;`;
    const [rows] = await connection.execute<RowDataPacket[]>(
      queryString,
      [query, auth, query]
    );
    return plainToInstance(Guide, await Post.getTags<Guide>(rows as Guide[]));
  }

  async editGuide(newGuide: Guide): Promise<void> {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await this.updatePost(newGuide, connection);
      await connection.query(`UPDATE guide
                              SET description = ?,
                                  body        = ?
                              WHERE guide_id = ?
      `, [newGuide.description, newGuide.body, newGuide.post_id]);
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }

  static async getSeries() {
    const connection = await getConnection();
    const [results] = await connection.execute<RowDataPacket[]>(
      `SELECT series_id, title
       FROM series`);
    return results;
  }
}
