import proxy from "@/api/proxy";
import {CTFEvent} from "@/types/ctftime/CTFEvent";

export async function getRank(): Promise<{ rank: number, localRank: number }> {
  const currentYear = new Date().getFullYear().toString();
  // return proxy("https://ctftime.org/api/v1/teams/122289/").then(response => response.json())
  //   .then(data => ({rank: data.rating[currentYear].rating_place, localRank: data.rating[currentYear].country_place}));
  return {
    rank: 105,
    localRank: 1,
  };
}

export async function getEvents(): Promise<CTFEvent[]> {
  // return fetch("/events").then(response => response.json());
  return [
    {
      "id": 1512,
      "place": 4,
      "name": "idekCTF 2021",
      "ctfPoints": 13394,
      "ratingPoints": 25.607,
      "ratingInProgress": false,
    },
    {
      "id": 1476,
      "place": 54,
      "name": "MetaCTF CyberGames 2021",
      "ctfPoints": 8325,
      "ratingPoints": 13.75,
      "ratingInProgress": false,
    },
    {
      "id": 1501,
      "place": 12,
      "name": "TFC CTF 2021",
      "ctfPoints": 3019,
      "ratingPoints": 17.332,
      "ratingInProgress": false,
    },
    {
      "id": 1438,
      "place": 3,
      "name": "K3RN3LCTF",
      "ctfPoints": 8220,
      "ratingPoints": 25.976,
      "ratingInProgress": false,
    },
    {
      "id": 1401,
      "place": 21,
      "name": "DamCTF 2021",
      "ctfPoints": 4703,
      "ratingPoints": 15.275,
      "ratingInProgress": false,
    },
    {
      "id": 1482,
      "place": 4,
      "name": "Killer Queen CTF 2021",
      "ctfPoints": 7129,
      "ratingPoints": 22.084,
      "ratingInProgress": false,
    },
    {
      "id": 1430,
      "place": 5,
      "name": "PBjar CTF '21",
      "ctfPoints": 10838,
      "ratingPoints": 23.602,
      "ratingInProgress": false,
    },
    {
      "id": 1364,
      "place": 20,
      "name": "corCTF 2021",
      "ctfPoints": 6873,
      "ratingPoints": 13.737,
      "ratingInProgress": false,
    },
    {
      "id": 1264,
      "place": 11,
      "name": "HSCTF 8",
      "ctfPoints": 16007,
      "ratingPoints": 24.036,
      "ratingInProgress": false,
    },
    {
      "id": 1369,
      "place": 5,
      "name": "BCACTF 2.0",
      "ctfPoints": 10100,
      "ratingPoints": 24.253,
      "ratingInProgress": false,
    },
  ];
}

// TODO: Refactor to backend
export async function getEventInfo(id: number): Promise<any> {
  return proxy(`https://ctftime.org/api/v1/events/${id}/`).then(response => response.json());
}
