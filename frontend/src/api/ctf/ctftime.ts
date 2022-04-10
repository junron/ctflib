import {fetchJSON, postJSON} from "@/api";
import {CTFTimeEvent} from "@/types/ctfs/CTFTimeEvent";
import {APIResponse} from "@/types/APIResponse";

export async function getCTFTimeEvents(): Promise<CTFTimeEvent[]> {
  const response = await fetchJSON<CTFTimeEvent[]>("/ctftime");
  return response.data.map(ctf => {
    ctf.start_date = new Date(ctf.start_date);
    ctf.end_date = new Date(ctf.end_date);
    return ctf;
  });
}

export async function getCTFTimeEvent(ctfId: number): Promise<CTFTimeEvent | null> {
  const response = await fetchJSON<CTFTimeEvent>("/ctftime/get/" + ctfId);
  if (!response.success) return null;
  response.data.start_date = new Date(response.data.start_date);
  response.data.end_date = new Date(response.data.end_date);
  return response.data;
}

export async function createCTFTimeEvent(ctf: Partial<CTFTimeEvent>): Promise<APIResponse<CTFTimeEvent>> {
  return postJSON("/ctftime/create", ctf);
}

export async function editCTFTimeEvent(ctf: Partial<CTFTimeEvent>): Promise<APIResponse<CTFTimeEvent>> {
  return postJSON("/ctftime/edit/" + ctf.event_id, ctf);
}
