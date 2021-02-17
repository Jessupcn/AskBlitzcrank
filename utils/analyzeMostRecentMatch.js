/* eslint-disable complexity */
const {
  championsCache,
  getMatchData,
  getSummonerByName,
  getSummonerMatches,
} = require('./');

const analyzeMostRecentMatch = async (summonerName) => {
  try {
    const summoner = await getSummonerByName(summonerName);
    console.log('SUMMONER', summoner)
    const summonerMatches = await getSummonerMatches(summoner.accountId);
  } catch (err) {
    console.error(err)
    throw err;
  }
}

module.exports = analyzeMostRecentMatch;
