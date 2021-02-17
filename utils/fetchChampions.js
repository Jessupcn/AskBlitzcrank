const axios = require('axios');
const { championsCache } = require('./index');

const fetchChampions = async () => {
  try {
    const response = await axios.get(`http://ddragon.leagueoflegends.com/cdn/11.3.1/data/en_US/champion.json`);

    const championsData = response.data.data;

    console.log('--> ', championsCache)
    for (let champion in championsData) {
      if (championsData[champion].id) {
        let currentChampion = championsData[champion];
        championsCache.set(currentChampion.key, currentChampion);
      }
    }
    console.log('><><><><><><><><><<><>', championsCache)
    return response;
  } catch (err) {
    console.log('this is where the error is')
    console.error(err);
    return err.response;
  }
};

module.exports = fetchChampions;
