import {fetchJSON} from "@/api/index";
import {Response} from "@/types/response";
import {User} from "@/types/user";

export async function login(username: string, password: string): Promise<Response<User>> {
  return fetchJSON("/login", {username, password});
}

export async function register(username: string,
                               password: string,
                               email: string,
                               githubUsername: string,
                               secret: string): Promise<Response<null>> {
  return fetchJSON("/register", {username, password, email, github: githubUsername, secret});
}
