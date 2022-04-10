import {CTFEvent} from "@/types/ctfs/CTFEvent";

export interface CTFTimeEvent extends CTFEvent {
  ctftime_id: number|null;
  winner_score: number|null;
  num_teams: number|null;
  score: number|null;
  ranking: number|null;
  weight: number|null;
  rating_points: number|null;
  image_url: string;
}
