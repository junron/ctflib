export class Resource {
  post_id: number
  poster_username: string
  post_category: string
  title: string
  is_private: boolean
  body: string
  tags: string[]

  constructor(post_id: number, poster_username: string, category: string, title: string, is_private: boolean, body: string, tags: string[]) {
    this.post_id = post_id;
    this.poster_username = poster_username;
    this.post_category = category;
    this.title = title;
    this.is_private = is_private;
    this.body = body;
    this.tags = tags;
  }

}
