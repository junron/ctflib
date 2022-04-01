import {APIResponse} from "@/types/APIResponse";
import {apiRoot} from "@/api/index";

export async function upload(file: File): Promise<APIResponse<string>> {
  const formData = new FormData();
  formData.append("file", file);
  return fetch(apiRoot + "/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  }).then((res) => res.json());
}
