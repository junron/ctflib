import {fetchJSON} from "@/api/index";
import {Response} from "@/types/response";
import {User} from "@/types/user";

export async function login(username: string, password: string): Promise<Response<User>> {
  return fetchJSON("/login", {username, password});
}
