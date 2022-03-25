import {ChallengeFile} from "@/types/challenges/challengeFile";

export interface Challenge {
  challenge_id: number;
  event_id: number;
  category_name: string;
  name: string;
  description: string;
  points: number;
  tags: string[];
  files: ChallengeFile[]
}
