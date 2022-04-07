export interface Writeup {
  challenge_id: number;
  writeup_id: number;
  poster_username: string;
  is_private: boolean;
  url?: string;
  body?: string;
}


export type WriteupSearchResult = {
  writeup_id: number;
  name: string;
  category_name: string;
  poster_username: string;
  ctf_name: string;
  challenge_id: number;
  event_id: number;
  tags: string[];
}
