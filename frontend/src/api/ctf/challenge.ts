import {Challenge} from "@/types/challenges/challenge";
import {APIResponse} from "@/types/APIResponse";
import {apiRoot} from "@/api";

function challengeToFormData(challenge: Challenge, ctf_id: number, files: File[]) {
  const props = ["name", "description", "points", "category_name"];
  const formData = new FormData();
  props.forEach(prop => formData.append(prop, (challenge as any)[prop]));
  formData.append("tags", JSON.stringify(challenge.tags));
  files.forEach(file => formData.append("files", file));
  formData.append("event_id", ctf_id.toString());
  return formData;
}

export async function createChallenge(ctfID: number,
                                      challenge: Challenge,
                                      files: File[]): Promise<APIResponse<Challenge>> {
  const formData = challengeToFormData(challenge, ctfID, files);
  return fetch(apiRoot + "/ctfs/get/" + ctfID + "/challenges/create", {
    method: "POST",
    body: formData,
    credentials: "include",
  }).then((res) => res.json());
}

export async function editChallenge(ctfID: number,
                                    challenge: Challenge,
                                    unchangedFiles: number[],
                                    files: File[]): Promise<APIResponse<Challenge>> {
  const formData = challengeToFormData(challenge, ctfID, files);
  formData.append("unchangedFiles", JSON.stringify(unchangedFiles));
  return fetch(`${apiRoot}/ctfs/get/${challenge.event_id}/challenges/edit/${challenge.challenge_id}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  }).then((res) => res.json());
}

export async function deleteChallenge(ctfID: number, challengeId: number): Promise<APIResponse<null>> {
  return fetch(`${apiRoot}/ctfs/get/${ctfID}/challenges/delete/${challengeId}`, {
    method: "DELETE",
    credentials: "include",
  }).then(res => res.json());
}
