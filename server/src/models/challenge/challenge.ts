import {ChallengeFile} from "./challengeFile";
import {Exclude, Expose, plainToInstance, Type} from "class-transformer";
import {IsArray, IsNumber, IsString, ValidateNested} from "class-validator";
import getConnection from "../../database/connect";
import {RowDataPacket} from "mysql2";
import {Writeup} from "../writeup";
import {Connection} from "mysql2/promise";

import * as fs from "fs/promises";
import {safeUnlink} from "../../util";


export type ChallengeEdit = Challenge & {
  unchangedFiles: number[]
}

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

  static async getTagsAndFiles(challenges: Challenge[], includeFilePath = false): Promise<Challenge[]> {
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
      `SELECT challenge_id, file_name, file_id ${includeFilePath ? ', file_path' : ''}
       FROM challenge_file
       where challenge_file.challenge_id IN (?)`,
      [challenges.map(challenge => challenge.challenge_id)]);

    challenges.forEach(challenge => {
      challenge.tags = [];
      challenge.files = [];
    });

    for (const tag of tags) {
      const challenge = challenges.find(
        challenge => challenge.challenge_id === tag.challenge_id);
      if (challenge) {
        challenge.tags.push(tag.tag_name);
      }
    }
    for (const file of files) {
      const challenge = challenges.find(
        challenge => challenge.challenge_id === file.challenge_id);
      const challengeFile = plainToInstance(ChallengeFile, file as ChallengeFile);
      if (challenge) {
        challenge.files.push(challengeFile);
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

  async editChallenge(newChallenge: ChallengeEdit): Promise<void> {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await connection.execute(
        `UPDATE challenge
         set name          = ?,
             category_name = ?,
             description   = ?,
             points        = ?
         where challenge_id = ?`,
        [
          newChallenge.name,
          newChallenge.category_name,
          newChallenge.description,
          newChallenge.points,
          newChallenge.challenge_id
        ]);
      // Update tags
      await this.updateTags(newChallenge, connection);
      // Update files
      await this.updateFiles(newChallenge, connection);
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }

  private async updateTags(newChallenge: ChallengeEdit, connection: Connection): Promise<void> {
    const tagsToRemove = this.tags.filter(tag => !newChallenge.tags.includes(tag));
    const tagsToAdd = newChallenge.tags.filter(tag => !this.tags.includes(tag));
    if (tagsToRemove.length > 0) {
      await connection.query("DELETE FROM challenge_tag WHERE challenge_id = ? AND tag_name IN (?)",
        [this.challenge_id, tagsToRemove]);
    }
    if (tagsToAdd.length > 0) {
      await connection.query("INSERT INTO challenge_tag (challenge_id, tag_name) VALUES ? ",
        [tagsToAdd.map(tag => [this.challenge_id, tag])]);
    }
  }

  private async updateFiles(newChallenge: ChallengeEdit, connection: Connection): Promise<void> {
    // Remove all files not in unchanged list
    const filesToRemove = this.files
      .filter(file => !newChallenge.unchangedFiles.includes(file.file_id));

    // Files specified are to be added
    const filesToAdd = newChallenge.files;
    if (filesToRemove.length > 0) {
      await connection.query("DELETE FROM challenge_file WHERE challenge_file.file_id IN (?)",
        [filesToRemove.map(file => file.file_id)]);
      await Promise.all(filesToRemove.map(file => safeUnlink(file.file_path)));
    }
    if (filesToAdd.length > 0) {
      await connection.query("INSERT INTO challenge_file (challenge_id, file_name, file_path, file_type) VALUES ? ",
        [filesToAdd.map(file => [this.challenge_id, file.file_name, file.file_path, file.file_type])]);
    }
  }

  async deleteChallenge() {
    const connection = await getConnection();
    await connection.beginTransaction();
    try {
      await connection.execute(
        `DELETE
         FROM challenge
         where challenge_id = ?`,
        [this.challenge_id]);
      // Delete tags
      await connection.execute(
        `DELETE
         FROM challenge_tag
         where challenge_id = ?`,
        [this.challenge_id]);
      // Delete files
      await connection.execute(
        `DELETE
         FROM challenge_file
         where challenge_id = ?`,
        [this.challenge_id]);
      await Promise.all(this.files.map(file => fs.unlink(file.file_path)));
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }
}
