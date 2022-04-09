import {fetchJSON, postJSON} from "@/api";
import {APIResponse} from "@/types/APIResponse";
import {Guide, Series} from "@/types/posts/guide";

export async function searchGuides(query: string): Promise<Guide[]> {
  const response = await fetchJSON<Guide[]>("/guides/search?q=" + query);
  return response.data;
}

export async function getGuide(guideID: number): Promise<APIResponse<Guide>> {
  return fetchJSON<Guide>("/guides/get/" + guideID);
}

export async function getSeries(): Promise<Series[]> {
  return (await fetchJSON<Series[]>("/guides/series")).data;
}


export async function createGuide(guide: Guide): Promise<APIResponse<Guide>> {
  return postJSON<Guide>("/guides/create", guide);
}

export async function editGuide(guide: Guide): Promise<APIResponse<Guide>> {
  return postJSON<Guide>("/guides/edit/" + guide.post_id, guide);
}
