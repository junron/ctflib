import {Category} from "@/types/posts/category";

export class Post {
  title: string
  description: string
  url: string
  tags: string[]

  constructor(data: { title: string, description: string, url: string, tags: string[] }) {
    this.title = data.title;
    this.description = data.description;
    this.url = data.url;
    this.tags = data.tags;
  }

}


export class PostItem extends Post {
  text: string
  value: string
  category: Category

  constructor(data: { title: string, description: string, url: string, tags: string[], category: Category }) {
    super(data);
    this.text = data.title;
    this.value = data.title;
    this.category = data.category;
  }

  queryPoints(query: string): number {
    let queryPoints = query.split(" ").reduce((acc, curr) => {
      if (this.title.includes(curr)) {
        return acc + 1;
      }
      if (this.description.includes(curr)) {
        return acc + 1;
      }
      if (this.tags.includes(curr)) {
        return acc + 1;
      }
      return acc;
    }, 0);
    queryPoints += this.tags.filter(tag => query.includes(tag)).length;
    if (this.category && query.includes(this.category.name)) {
      queryPoints += 1;
    }
    return queryPoints;
  }
}
