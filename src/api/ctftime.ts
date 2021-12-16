import proxy from "@/api/proxy";
import {CTFEvent} from "@/types/ctftime/CTFEvent";

export async function getRank(): Promise<{ rank: number, localRank: number }> {
  const currentYear = new Date().getFullYear().toString();
  return proxy("https://ctftime.org/api/v1/teams/122289/").then(response => response.json())
    .then(data => ({rank: data.rating[currentYear].rating_place, localRank: data.rating[currentYear].country_place}));
}

export async function getEvents(): Promise<CTFEvent[]> {
  return fetch("/events").then(response => response.json());
}

// TODO: Refactor to backend
export async function getEventInfo(id: number): Promise<any> {
  return proxy(`https://ctftime.org/api/v1/events/${id}/`).then(response => response.json());
}
