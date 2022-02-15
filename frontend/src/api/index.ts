import {Response} from "@/types/response";

export const apiRoot = location.hostname == "localhost"
  ? location.origin
  : "https://api.ctflib.junron.dev";

export function postJSON<T>(path: string, data: any): Promise<Response<T>> {
  return fetch(apiRoot + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  }).then((res) => res.json());
}


export function fetchJSON<T>(path: string): Promise<Response<T>> {
  return fetch(apiRoot + path, {
    method: "GET",
  }).then((res) => res.json());
}
