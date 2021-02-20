const mostPlayedChampions = require('./mostPlayedChampions');
const { getSummonerByName, getSummonerMatches } = require('./summoner');

/**
 * This method will search for multiple summoner names and
 * return champion data and league info about them.
 *
 * @param {*} summonerArray = array of summoner names to
 * search for.
 */

const clashSearch = async (summonerArray) => {
  try {
    const summoners = await Promise.all(summonerArray.map(summoner => getSummonerByName(summoner)));

    const summonerMatches = await Promise.all(summoners.map(summoner => getSummonerMatches(summoner.accountId)))

    return summoners.map((summoner, idx) => {
      return {
        summoner,
        mostPlayedChampions: summonerMatches[idx]
          .matches
          .map(matches => {
            console.log('matches!', matches)
            return mostPlayedChampions(matches)
          })
      }
    })

    // return summonerMatches.map(matchesObj => mostPlayedChampions(matchesObj.matches))
  } catch (err) {
    console.error(err)
    throw err;
  }
}

module.exports = clashSearch;
