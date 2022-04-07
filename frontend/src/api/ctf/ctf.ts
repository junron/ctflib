import {apiRoot, fetchJSON, postJSON} from "@/api";
import {CTFEvent} from "@/types/ctfs/CTFEvent";
import {Challenge} from "@/types/challenges/challenge";
import {APIResponse} from "@/types/APIResponse";

export async function getCTFs(includeCTFTime = false): Promise<CTFEvent[]> {
  const response = await fetchJSON<CTFEvent[]>("/ctfs" + (includeCTFTime ? "?includeCTFTime=true" : ""));
  return response.data.map(ctf => {
    ctf.start_date = new Date(ctf.start_date);
    ctf.end_date = new Date(ctf.end_date);
    return ctf;
  });
}

export type CTFSeries = { name: string, organizer: string }

export async function getCTFNames(): Promise<CTFSeries[]> {
  const response = await fetchJSON<CTFSeries[]>("/ctfs/names");
  return response.data;
}

export async function getChallenges(ctfID: number): Promise<Challenge[]> {
  return (await fetchJSON<Challenge[]>(`/ctfs/get/${ctfID}/challenges`)).data;
}

export async function createChallenge(ctfID: number,
                                      challenge: Challenge,
                                      files: File[]): Promise<APIResponse<Challenge>> {
  const props = ["name", "description", "points", "category_name"];
  const formData = new FormData();
  props.forEach(prop => formData.append(prop, (challenge as any)[prop]));
  formData.append("tags", challenge.tags.join(","));
  files.forEach(file => formData.append("files", file));
  formData.append("event_id", ctfID.toString());
  return fetch(apiRoot + "/ctfs/get/" + ctfID + "/challenges/create", {
    method: "POST",
    body: formData,
    credentials: "include",
  }).then((res) => res.json());
}


export async function createCTF(ctf: CTFEvent): Promise<APIResponse<CTFEvent>> {
  return postJSON("/ctfs/create", ctf);
}
