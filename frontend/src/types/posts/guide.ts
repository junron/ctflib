export class Guide {
  post_id: number
  poster_username: string
  post_category: string
  title: string
  is_private: boolean
  body: string
  description: string
  series_id: number | null = null
  series_name: string | null = null
  next: number | null = null
  prev: number | null = null
  tags: string[]

  constructor(post_id: number,
              poster_username: string,
              category: string,
              title: string,
              is_private: boolean,
              body: string,
              description: string,
              tags: string[]) {
    this.post_id = post_id;
    this.poster_username = poster_username;
    this.post_category = category;
    this.title = title;
    this.is_private = is_private;
    this.body = body;
    this.description = description;
    this.tags = tags;
  }
}


export type Series = {
  title: string,
  series_id: number,
}
