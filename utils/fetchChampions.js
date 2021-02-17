const axios = require('axios');
const championsCache = require('./championCache');

const fetchChampions = async () => {
  try {
    const response = await axios.get(`http://ddragon.leagueoflegends.com/cdn/11.3.1/data/en_US/champion.json`);

    const championsData = response.data.data;

    for (let champion in championsData) {
      if (championsData[champion].id) {
        let currentChampion = championsData[champion];
        championsCache.set(currentChampion.key, currentChampion);
      }
    }
    return response;
  } catch (err) {
    console.error(err);
    return err.response;
  }
};

module.exports = fetchChampions;
