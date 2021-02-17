const analyzeMostRecentMatch = require('./analyzeMostRecentMatch');
const analyzeRecentMatches = require('./analyzeRecentMatches');
const championsCache = require('./championsCache');
const domain = require('./domain');
const fetchChampions = require('./fetchChampions');
const getMatchData = require('./match');
const { getSummonerByName, getSummonerMatches } = require('./summoner');

console.log('CHAMPS CACHE', championsCache)

module.exports = {
  analyzeMostRecentMatch,
  analyzeRecentMatches,
  championsCache,
  domain,
  fetchChampions,
  getMatchData,
  getSummonerByName,
  getSummonerMatches,
}
