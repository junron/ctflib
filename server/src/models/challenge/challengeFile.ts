import {Exclude, Expose} from "class-transformer";
import {IsNumber, IsString} from "class-validator";

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
}
