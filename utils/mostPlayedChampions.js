const championsCache = require('../championsCache');

/**
 * This util method takes an array of matches and returns an
 * array of the most played champions.
 */
const mostPlayedChampions = (matchesArray) => {
  const championsCount = {};
  matchesArray
    .forEach(game => {
      // champion used in game
      const championUsed = championsCache.get(String(game.champion));

      // update championTrend
      if (championsCount[championUsed.id]) {
        championsCount[championUsed.id]++;
      } else {
        championsCount[championUsed.id] = 1;
      }
    })

  // top 12 champions most played.
  const topTwelveChampions = Object.entries(championsCount)
    .sort((championA, championB) => championB[1] - championA[1])
    .slice(0, 12)

  return topTwelveChampions;
}

module.exports = mostPlayedChampions;
