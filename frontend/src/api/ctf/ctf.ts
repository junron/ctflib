import {fetchJSON} from "@/api";
import {CTFEvent} from "@/types/ctfs/CTFEvent";
import {Challenge} from "@/types/challenges/challenge";

export async function getCTFs(includeCTFTime = false): Promise<CTFEvent[]> {
  const response = await fetchJSON<CTFEvent[]>("/ctfs" + (includeCTFTime ? "?includeCTFTime=true" : ""));
  return response.data.map(ctf => {
    ctf.start_date = new Date(ctf.start_date);
    ctf.end_date = new Date(ctf.end_date);
    return ctf;
  });
}


export async function getChallenges(ctfID: number): Promise<Challenge[]> {
  return (await fetchJSON<Challenge[]>(`/ctfs/get/${ctfID}/challenges`)).data;
}
