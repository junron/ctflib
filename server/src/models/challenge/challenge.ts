import {ChallengeFile} from "./challengeFile";
import {Exclude, Expose, plainToInstance, Type} from "class-transformer";
import {IsArray, IsNumber, IsString, ValidateNested} from "class-validator";
import getConnection from "../../database/connect";
import {RowDataPacket} from "mysql2";
import {Writeup} from "../writeup";

@Exclude()
export class Challenge {
  @Expose()
  @IsNumber()
  challenge_id: number = -1;
  @Expose()
  @IsNumber()
  event_id!: number;
  @Expose()
  @IsString()
  category_name!: string;
  @Expose()
  @IsString()
  name!: string;
  @Expose()
  @IsString()
  description!: string;
  @Expose()
  @IsNumber()
  points!: number;
  @Expose()
  @IsString({each: true})
  tags: string[] = [];

  @Expose()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ChallengeFile)
  files: ChallengeFile[] = [];

  static async getTagsAndFiles(challenges: Challenge[]): Promise<Challenge[]> {
    if (challenges.length == 0) {
      return challenges;
    }
    const connection = await getConnection();
    const [tags] = await connection.query<RowDataPacket[]>(
      `SELECT challenge_id, tag_name
       FROM challenge_tag
       where challenge_tag.challenge_id IN (?)`,
      [challenges.map(challenge => challenge.challenge_id)]);

    const [files] = await connection.query<RowDataPacket[]>(
      `SELECT challenge_id, file_name, file_id
       FROM challenge_file
       where challenge_file.challenge_id IN (?)`,
      [challenges.map(challenge => challenge.challenge_id)]);
    for (const tag of tags) {
      const challenge = challenges.find(
        challenge => challenge.challenge_id === tag.challenge_id);
      if (challenge) {
        if (challenge.tags != undefined) {
          challenge.tags.push(tag.tag_name);
        } else {
          challenge.tags = [tag.tag_name];
        }
      }
    }
    for (const file of files) {
      const challenge = challenges.find(
        challenge => challenge.challenge_id === file.challenge_id);
      const challengeFile = plainToInstance(ChallengeFile, file as ChallengeFile);
      if (challenge) {
        if (challenge.files != undefined) {
          challenge.files.push(challengeFile);
        } else {
          challenge.files = [challengeFile];
        }
      }
    }
    return challenges;
  }

  static async getChallengeByID(challenge_id: number): Promise<Challenge> {
    const connection = await getConnection();
    const [challenge] = await connection.query<RowDataPacket[]>(
      `SELECT challenge_id, event_id, category_name, name, description, points
       FROM challenge
       WHERE challenge_id = ?`,
      [challenge_id]);
    return plainToInstance(Challenge, challenge[0]);
  }

  async getWriteups(auth: boolean): Promise<Writeup[]> {
    const connection = await getConnection();
    const [writeups] = await connection.query<RowDataPacket[]>(
      `SELECT writeup_id, challenge_id, poster_username, is_private, body, url
       FROM writeup
                left join external_writeup ew on writeup.writeup_id = ew.external_writeup_id
                left join internal_writeup iw on writeup.writeup_id = iw.internal_writeup_id
       where writeup.challenge_id = ?
         and (is_private = FALSE
           or ? = TRUE)`,
      [this.challenge_id, auth]);
    return plainToInstance(Writeup, writeups, {exposeDefaultValues: true});
  }

  async create(): Promise<void> {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await connection.execute(`INSERT INTO challenge (name, category_name, description, points, event_id)
                                VALUES (?, ?, ?, ?, ?)`,
        [this.name, this.category_name, this.description, this.points, this.event_id]);
      const [lastID] = await connection.execute<RowDataPacket[]>("SELECT LAST_INSERT_ID() as id");
      this.challenge_id = lastID[0].id;
      // Insert tags
      if (this.tags.length > 0) {
        await connection.query("INSERT INTO challenge_tag (challenge_id, tag_name) VALUES ? ",
          [this.tags.map(tag => [lastID[0].id, tag])]);
      }
      // Insert files
      if (this.files.length > 0) {
        await connection.query("INSERT INTO challenge_file (challenge_id, file_name, file_path, file_type) VALUES ? ",
          [this.files.map(file => [lastID[0].id, file.file_name, file.file_path, file.file_type])]);
      }
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }
}
