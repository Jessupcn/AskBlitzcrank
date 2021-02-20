const analyzeRecentMatches = require('./analyzeRecentMatches');
const analyzeMostRecentMatch = require('./analyzeMostRecentMatch')
const clashSearch = require('./clashSearch')
const fetchChampions = require('./fetchChampions');
const makePercent = require('./makePercent')

module.exports = {
  analyzeMostRecentMatch,
  analyzeRecentMatches,
  clashSearch,
  fetchChampions,
  makePercent,
}
