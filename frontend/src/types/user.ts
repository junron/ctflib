export class User {
  username: string;
  email: string;
  github_username: string;

  constructor(username: string, email: string, github_username: string) {
    this.username = username;
    this.email = email;
    this.github_username = github_username;
  }

  static fromJson(json: any): User {
    return new User(
      json.username,
      json.email,
      json.github_username,
    );
  }
}
