export interface Writeup {
  challenge_id: number;
  writeup_id: number;
  poster_username: string;
  is_private: boolean;
  url?: string;
  body?: string;
}
