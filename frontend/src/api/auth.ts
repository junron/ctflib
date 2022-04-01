import {fetchJSON, postJSON} from "@/api/index";
import {APIResponse} from "@/types/APIResponse";
import {User} from "@/types/user";

export async function login(username: string, password: string): Promise<APIResponse<User>> {
  return postJSON("/login", {username, password});
}

export async function register(username: string,
                               password: string,
                               email: string,
                               githubUsername: string,
                               secret: string): Promise<APIResponse<null>> {
  return postJSON("/register", {username, password, email, github: githubUsername, secret});
}

export async function me(): Promise<APIResponse<User>> {
  return fetchJSON("/me");
}

export async function logout(): Promise<APIResponse<null>> {
  return postJSON("/logout", {});
}
