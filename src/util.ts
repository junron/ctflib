// Add ordinal suffix to rank
export default function formatRank(rank: number): string {
  const suffix = ["th", "st", "nd", "rd"];
  const mod = rank % 100;
  return rank + (suffix[(mod - 20) % 10] || suffix[mod] || suffix[0]);
}
