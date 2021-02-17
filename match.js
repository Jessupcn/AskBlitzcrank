const axios = require('axios');
const auth = require('./auth.json');
const domain = require('./utils/domain.js');

const getMatchData = async (matchId) => {
  const summonerObj = await axios.get(
    `${domain}/match/v4/matches/${matchId}?api_key=${auth.leagueToken}`
  );
  return summonerObj.data;
};

module.exports = { getMatchData };
