import {Response} from "@/types/response";

export const apiRoot = location.hostname == "localhost"
  ? location.origin
  : "https://api.ctflib.junron.dev";

export function fetchJSON<T>(path: string, data: any): Promise<Response<T>> {
  return fetch(apiRoot + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}
