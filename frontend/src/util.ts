// Add ordinal suffix to rank
import {Category} from "@/types/category";

export default function formatRank(rank: number): string {
  const suffix = ["th", "st", "nd", "rd"];
  const mod = rank % 100;
  return rank + (suffix[(mod - 20) % 10] || suffix[mod] || suffix[0]);
}


export function effectiveColor(category: Category, dark: boolean): string {
  return dark ? (category.light_color || category.color) : category.color;
}
