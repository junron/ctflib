import {CTFEvent} from "@/types/ctfs/CTFEvent";

export interface CTFTimeEvent extends CTFEvent {
  ctftime_id: number;
  winner_score: number;
  num_teams: number;
  score: number;
  ranking: number;
  weight: number;
  rating_points: number;
}
