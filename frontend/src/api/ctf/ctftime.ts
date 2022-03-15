import {fetchJSON} from "@/api";
import {CTFTimeEvent} from "@/types/ctfs/CTFTimeEvent";

export async function getCTFTimeEVents(): Promise<CTFTimeEvent[]> {
  const response = await fetchJSON<CTFTimeEvent[]>("/ctftime");
  return response.data.map(ctf => {
    ctf.start_date = new Date(ctf.start_date);
    ctf.end_date = new Date(ctf.end_date);
    return ctf;
  });
}
