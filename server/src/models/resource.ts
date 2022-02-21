import {Post} from "./post";
import {Expose} from "class-transformer";
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
      return (await Post.getTags(result as Resource[]))[0];
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
    return Post.getTags<Resource>(result as Resource[]);
  }


  static async search(query: string, auth: boolean) {
    const connection = await getConnection();
    const queryString = `SELECT post.*
                         FROM post,
                              resource
                         WHERE (is_private = false OR ? = true)
                           AND (title LIKE ? OR post_category LIKE ? OR body LIKE ?)
                           AND post_id = resource_id`;
    const [rows] = await connection.execute<RowDataPacket[]>(queryString, [auth, `%${query}%`, `%${query}%`, `%${query}%`]);
    return Post.getTags<Resource>(rows as Resource[]);
  }
}
