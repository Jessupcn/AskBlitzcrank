/* eslint-disable complexity */
const axios = require('axios');
const auth = require('../auth.json');
const domain = require('./domain');

const RIOT_API_KEY = process.env.RIOT_API_KEY || auth.leagueToken;

const getSummonerByName = async (summonerName) => {
  try {
    const summonerObj = await axios.get(
      `${domain}/summoner/v4/summoners/by-name/${summonerName}?api_key=${RIOT_API_KEY}`
    );
    return summonerObj.data;
  } catch (err) {
    throw err;
  }
};

const getSummonerMatches = async (summonerId) => {
  try {
    const summonerMatches = await axios.get(
      `${domain}/match/v4/matchlists/by-account/${summonerId}?api_key=${RIOT_API_KEY}`
    );
    return summonerMatches.data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getSummonerByName,
  getSummonerMatches,
};
