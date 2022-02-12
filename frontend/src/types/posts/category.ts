import {Post} from "@/types/posts/post";

export interface Category {
  name: string;
  icon: string;
  color: string;
  darkColor?: string;

  posts: Post[]
}
