import {Post} from "./post";
import {Expose, plainToInstance} from "class-transformer";
import {IsString} from "class-validator";
import getConnection from "../database/connect";
import {RowDataPacket} from "mysql2";

export class Resource extends Post {
  @Expose()
  @IsString()
  body: string

  constructor(poster_username: string, category: string, title: string, body: string, is_private: boolean = true, tags: string[] = []) {
    super(poster_username, category, title, is_private, tags);
    this.body = body;
  }


  async create() {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await super.create(connection);
      await connection.execute(`INSERT INTO resource (resource_id, body)
                                VALUES (?, ?)`, [this.post_id, this.body]);
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }

  static async getResourceById(post_id: number, auth: boolean) {
    const connection = await getConnection();
    const [result] = await connection.execute<RowDataPacket[]>(
      `SELECT post.*, resource.body
       FROM post,
            resource
       WHERE post_id = ?
         AND resource_id = post.post_id
         AND (is_private = false
           OR ? = true)`, [post_id, auth]);
    if (result.length === 1) {
      const resource = (await Post.getTags(result as Resource[]))[0];
      return plainToInstance(Resource, resource, {exposeDefaultValues: true});
    }
    return null;
  }

  async deleteResource() {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await connection.execute(`DELETE
                                FROM resource
                                WHERE resource_id = ?`, [this.post_id]);
      await super.deletePost(connection);
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }


  static async search(query: string, auth: boolean) {
    const connection = await getConnection();
    const queryString = `
        with posts as (
            select post.post_id,
                   post.title,
                   post.post_category,
                   resource.body,
                   pt.tag_name,
                   is_private,
                   calculate_score(
                           title,
                           body,
                           '','',
                           tag_name,
                           post_category,
                           ?) as _score
            from post
                     inner join resource on resource_id = post.post_id
                     left join post_tag pt on post.post_id = pt.post_id
            where (is_private = false or ? = true)
        )
        select posts.*,
               _score + (
                            select count(*)
                            from posts p
                            where ? like concat('%', p.tag_name, '%')
                              and p.post_id = posts.post_id
                        ) * 3 # 3 points for every tag contained in the query text
                   as score
        from posts
             # Only obtain the maximum score
        where _score >= all (select _score from posts p where p.post_id = posts.post_id)
        group by post_id
        having score > 0
        order by score desc;`;
    const [rows] = await connection.execute<RowDataPacket[]>(
      queryString,
      [query, auth, query]
    );
    return plainToInstance(Resource, await Post.getTags<Resource>(rows as Resource[]));
  }

  async editResource(newResource: Resource): Promise<void> {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await this.updatePost(newResource, connection);
      await connection.query("UPDATE resource SET body = ? WHERE resource_id = ?", [newResource.body, this.post_id]);
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }
}
