const axios = require('axios');
const auth = require('./auth.json');
const domain = require('./utils/domain.js');
const { getMatchData } = require('./match.js');
const championCache = require('./utils/championCache');

const getSummonerObj = async (summonerName) => {
  try {
    const summonerObj = await axios.get(
      `${domain}/summoner/v4/summoners/by-name/${summonerName}?api_key=${auth.leagueToken}`
    );
    return summonerObj.data;
  } catch (err) {
    throw err;
  }
};

const getSummonerMatches = async (summonerId) => {
  try {
    const summonerMatches = await axios.get(
      `${domain}/match/v4/matchlists/by-account/${summonerId}?api_key=${auth.leagueToken}`
    );
    return summonerMatches.data;
  } catch (err) {
    throw err;
  }
};

const analyzeRecentMatches = async (summonerName) => {
  try {
    const summoner = await getSummonerObj(summonerName);
    console.log('SUMMONER', summoner)
    const summonerMatches = await getSummonerMatches(summoner.accountId);

    const numRecentSummonerMatches = summonerMatches.matches.length;

    const fetchRecentGames = await Promise.all(
      summonerMatches.matches
      .slice(0, 15)
      .map((match) => getMatchData(match.gameId))
    )
    const recentGames = {
      win: 0,
      loss: 0,
      champions: {}
    }
    console.log(fetchRecentGames[0])
    // fetchRecentGames.forEach(game => {

    // })

    return { numRecentSummonerMatches, recentGames };
  } catch (err) {
    console.error(err)
    throw err;
  }
}

module.exports = { getSummonerObj, getSummonerMatches, analyzeRecentMatches };
