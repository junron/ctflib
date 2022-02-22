import {Resource} from "@/types/posts/resource";
import {fetchJSON} from "@/api";

export async function getResources(): Promise<Resource[]> {
  const response = await fetchJSON<Resource[]>("/resources");
  return response.data;
}
