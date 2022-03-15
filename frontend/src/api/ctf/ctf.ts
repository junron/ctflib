import {fetchJSON} from "@/api";
import {CTFEvent} from "@/types/ctfs/CTFEvent";

export async function getCTFs(): Promise<CTFEvent[]> {
  const response = await fetchJSON<CTFEvent[]>("/ctfs");
  return response.data.map(ctf => {
    ctf.start_date = new Date(ctf.start_date);
    ctf.end_date = new Date(ctf.end_date);
    return ctf;
  });
}
