import {Resource} from "@/types/posts/resource";
import {apiRoot, fetchJSON, postJSON} from "@/api";
import {Response} from "@/types/response";

export async function getResources(): Promise<Resource[]> {
  const response = await fetchJSON<Resource[]>("/resources");
  return response.data;
}

export type PostResource = {
  title: string,
  category: string,
  is_private: boolean,
  tags: string[],
  body: string,
}

export async function createResource(resource: PostResource): Promise<Response<Resource>> {
  return postJSON<Resource>("/resources/create", resource);
}

export async function deleteResource(resourceId: number): Promise<Response<null>> {
  return fetch(apiRoot + `/resources/delete/${resourceId}`, {
    method: "DELETE",
    credentials: "include",
  }).then(res => res.json());
}
