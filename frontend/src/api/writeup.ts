import {apiRoot, fetchJSON, postJSON} from "@/api/index";
import {Challenge} from "@/types/challenges/challenge";
import {Writeup, WriteupSearchResult} from "@/types/writeup";
import {APIResponse} from "@/types/APIResponse";

export async function getWriteupsForChallenge(challenge: Challenge): Promise<Writeup[]> {
  const response = await fetchJSON<Writeup[]>(
    `/ctfs/get/${challenge.event_id}/challenges/${challenge.challenge_id}/writeups`);
  if (!response.success) {
    throw new Error("Failed to fetch categories");
  }
  return response.data;
}

export async function createWriteup(writeup: Writeup): Promise<Writeup> {
  const response = await postJSON<Writeup>(
    `/writeups/create`,
    writeup);
  if (!response.success) {
    throw new Error("Failed to create writeup");
  }
  return response.data;
}


export async function editWriteup(writeup: Writeup): Promise<Writeup> {
  const response = await postJSON<Writeup>(
    `/writeups/edit/${writeup.writeup_id}`,
    writeup);
  if (!response.success) {
    throw new Error("Failed to edit writeup");
  }
  return response.data;
}

export async function deleteWriteup(writeupID: number): Promise<APIResponse<null>> {
  return fetch(apiRoot + `/writeups/delete/${writeupID}`, {
    method: "DELETE",
    credentials: "include",
  }).then(res => res.json());
}

export async function searchWriteups(query: string): Promise<WriteupSearchResult[]> {
  const response = await fetchJSON<WriteupSearchResult[]>("/writeups/search?q=" + query);
  return response.data;
}
