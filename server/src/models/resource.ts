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


  static async getResources(auth: boolean) {
    const connection = await getConnection();
    const [result] = await connection.execute<RowDataPacket[]>(
      `SELECT post.*, resource.body
       FROM post,
            resource
       WHERE resource_id = post.post_id
         AND (is_private = false
           OR ? = true)`, [auth]);
    return plainToInstance(Resource, Post.getTags<Resource>(result as Resource[]));
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
    const queryString = `SELECT post.*, r.body
                         FROM post
                                  inner join resource r on post.post_id = r.resource_id
                                  left join post_tag on post_tag.post_id = post.post_id
                         WHERE (is_private = false OR ? = true)
                           AND (title LIKE ?
                             OR post_category LIKE ?
                             OR body LIKE ?
                             OR tag_name LIKE ?)
                         group by post.post_id;`;
    const [rows] = await connection.execute<RowDataPacket[]>(queryString, [auth, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
    return plainToInstance(Resource, Post.getTags<Resource>(rows as Resource[]));
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
