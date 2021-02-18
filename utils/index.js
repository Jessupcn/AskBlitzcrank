const fetchChampions = require('./fetchChampions');
const analyzeRecentMatches = require('./analyzeRecentMatches');
const analyzeMostRecentMatch = require('./analyzeMostRecentMatch')
const clashSearch = require('./clashSearch')

module.exports = {
  analyzeMostRecentMatch,
  analyzeRecentMatches,
  fetchChampions,
  clashSearch,
}
