import {fetchJSON} from "@/api/index";

export async function getTags(category: string): Promise<string[]> {
  const response = await fetchJSON<string[]>("/tags?category=" + category);
  if (!response.success) {
    throw new Error("Failed to fetch tags");
  }
  return response.data;
}
