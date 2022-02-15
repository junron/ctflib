import {fetchJSON, postJSON} from "@/api/index";
import {Response} from "@/types/response";
import {User} from "@/types/user";

export async function login(username: string, password: string): Promise<Response<User>> {
  return postJSON("/login", {username, password});
}

export async function register(username: string,
                               password: string,
                               email: string,
                               githubUsername: string,
                               secret: string): Promise<Response<null>> {
  return postJSON("/register", {username, password, email, github: githubUsername, secret});
}

export async function me(): Promise<Response<User>> {
  return fetchJSON("/me");
}

export async function logout(): Promise<Response<null>> {
  return postJSON("/logout", {});
}
