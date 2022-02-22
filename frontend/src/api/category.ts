import {Category} from "@/types/category";
import {fetchJSON} from "@/api/index";

export async function getCategories(): Promise<Category[]> {
  const response = await fetchJSON<Category[]>("/categories");
  if (!response.success) {
    throw new Error("Failed to fetch categories");
  }
  return response.data;
}
