export async function getRank(): Promise<{ rank: number, localRank: number }> {
  const currentYear = new Date().getFullYear().toString();
  // return proxy("https://ctftime.org/api/v1/teams/122289/").then(response => response.json())
  //   .then(data => ({rank: data.rating[currentYear].rating_place, localRank: data.rating[currentYear].country_place}));
  return {
    rank: 105,
    localRank: 1,
  };
}
