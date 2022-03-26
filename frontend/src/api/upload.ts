import {Response} from "@/types/response";
import {apiRoot} from "@/api/index";

export async function upload(file: File): Promise<Response<string>> {
  const formData = new FormData();
  formData.append("file", file);
  return fetch(apiRoot + "/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  }).then((res) => res.json());
}
