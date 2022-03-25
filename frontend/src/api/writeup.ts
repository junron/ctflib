import {fetchJSON} from "@/api/index";
import {Challenge} from "@/types/challenges/challenge";
import {Writeup} from "@/types/writeup";

export async function getWriteupsForChallenge(challenge: Challenge): Promise<Writeup[]> {
  const response = await fetchJSON<Writeup[]>(
    `/ctfs/get/${challenge.event_id}/challenges/${challenge.challenge_id}/writeups`);
  if (!response.success) {
    throw new Error("Failed to fetch categories");
  }
  return response.data;
}
