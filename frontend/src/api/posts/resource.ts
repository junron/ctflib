import {Resource} from "@/types/posts/resource";
import {apiRoot, fetchJSON, postJSON} from "@/api";
import {APIResponse} from "@/types/APIResponse";

export async function getResources(): Promise<Resource[]> {
  const response = await fetchJSON<Resource[]>("/resources");
  return response.data;
}

export async function createResource(resource: Resource): Promise<APIResponse<Resource>> {
  return postJSON<Resource>("/resources/create", resource);
}

export async function deleteResource(resourceId: number): Promise<APIResponse<null>> {
  return fetch(apiRoot + `/resources/delete/${resourceId}`, {
    method: "DELETE",
    credentials: "include",
  }).then(res => res.json());
}

export async function editResource(resource: Resource): Promise<APIResponse<Resource>> {
  return postJSON<Resource>("/resources/edit/"+resource.post_id, resource);
}
