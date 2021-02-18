const axios = require('axios');
// const auth = require('../auth.json');
const domain = require('./domain');

// const RIOT_API_KEY = process.env.RIOT_API_KEY || auth.leagueToken;
const RIOT_API_KEY = process.env.RIOT_API_KEY;

const getMatchData = async (matchId) => {
  const summonerObj = await axios.get(
    `${domain}/match/v4/matches/${matchId}?api_key=${RIOT_API_KEY}`
  );
  return summonerObj.data;
};

module.exports = getMatchData;
