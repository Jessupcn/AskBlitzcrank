const axios = require('axios');
const auth = require('./auth.json');
const domain = require('./domain.js');

const getSummonerObj = async (summonerName) => {
  const summonerObj = await axios.get(
    `${domain}/summoner/v4/summoners/by-name/${summonerName}?api_key=${auth.leagueToken}`
  );
  return summonerObj.data;
};

const getSummonerMatches = async (summonerId) => {
  const summonerMatches = await axios.get(
    `${domain}/match/v4/matchlists/by-account/${summonerId}?api_key=${auth.leagueToken}`
  );
  return summonerMatches.data;
};

module.exports = { getSummonerObj, getSummonerMatches };
