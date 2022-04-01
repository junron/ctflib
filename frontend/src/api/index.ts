import {APIResponse} from "@/types/APIResponse";

export const apiRoot = location.hostname == "localhost"
  ? location.origin
  : "https://api.ctflib.junron.dev";

export function postJSON<T>(path: string, data: any): Promise<APIResponse<T>> {
  return fetch(apiRoot + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  }).then((res) => res.json());
}


export function fetchJSON<T>(path: string): Promise<APIResponse<T>> {
  return fetch(apiRoot + path, {
    method: "GET",
    credentials: "include",
  }).then((res) => res.json());
}
