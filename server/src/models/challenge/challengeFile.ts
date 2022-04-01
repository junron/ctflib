import {Exclude, Expose, plainToInstance} from "class-transformer";
import {IsNumber, IsString} from "class-validator";
import getConnection from "../../database/connect";
import {RowDataPacket} from "mysql2";

@Exclude()
export class ChallengeFile {
  @Expose()
  @IsNumber()
  file_id: number = -1;
  @Expose()
  @IsNumber()
  challenge_id!: number;
  @Expose()
  @IsString()
  file_name!: string;
  @Expose()
  @IsString()
  file_type: string = "";
  @Expose()
  @IsString()
  file_path: string = "";

  constructor(file_name: string, file_type: string, file_path: string) {
    this.file_name = file_name;
    this.file_type = file_type;
    this.file_path = file_path;
  }

  static async getFileByID(id: number): Promise<ChallengeFile> {
    const connection = await getConnection();
    const [result,_] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM challenge_file WHERE file_id = ?",
      [id]
    );
    return plainToInstance(ChallengeFile, result[0] as ChallengeFile);
  }
}
