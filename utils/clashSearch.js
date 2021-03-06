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

    return summoners.map((summoner, idx) => ({
        summoner,
        mostPlayedChampions: mostPlayedChampions(summonerMatches[idx].matches),
      }))
  } catch (err) {
    console.error(err)
    throw err;
  }
}

module.exports = clashSearch;
