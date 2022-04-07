import {fetchJSON, postJSON} from "@/api/index";
import {Challenge} from "@/types/challenges/challenge";
import {Writeup, WriteupSearchResult} from "@/types/writeup";

export async function getWriteupsForChallenge(challenge: Challenge): Promise<Writeup[]> {
  const response = await fetchJSON<Writeup[]>(
    `/ctfs/get/${challenge.event_id}/challenges/${challenge.challenge_id}/writeups`);
  if (!response.success) {
    throw new Error("Failed to fetch categories");
  }
  return response.data;
}

export async function createWriteup(challenge: Challenge, writeup: Writeup): Promise<Writeup> {
  const response = await postJSON<Writeup>(
    `/ctfs/get/${challenge.event_id}/challenges/${challenge.challenge_id}/writeups/create`,
    writeup);
  if (!response.success) {
    throw new Error("Failed to create writeup");
  }
  return response.data;
}

export async function searchWriteups(query: string): Promise<WriteupSearchResult[]> {
  const response = await fetchJSON<WriteupSearchResult[]>("/writeups/search?q=" + query);
  return response.data;
}
