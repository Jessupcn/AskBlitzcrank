/* eslint-disable complexity */
const getMatchData = require('./getMatchData')
const {
  getSummonerByName,
  getSummonerMatches,
} = require('./summoner');
const championsCache = require('../championsCache')

const analyzeMostRecentMatch = async (summonerName) => {
  try {
    // initial returns
    let top = null;
    let jungle = null;
    let mid = null;
    let carry = null;
    let support = null;
    const players = [];
    let bans = [];

    const summoner = await getSummonerByName(summonerName);
    const summonerMatches = await getSummonerMatches(summoner.accountId);
    const mostRecentMatch = await getMatchData(summonerMatches.matches[0].gameId);

    const summonerParticipantIdentity = mostRecentMatch.participantIdentities
      .find((participant) => summoner.id === participant.player.summonerId)
    const summonerParticipant = mostRecentMatch.participants
      .find(elem => elem.participantId === summonerParticipantIdentity.participantId)

    // get summoners' data and attach to proper position
    mostRecentMatch.participants
      .filter((elem) => elem.teamId === summonerParticipant.teamId)
      .map(participant => {
        const mapSummoner = mostRecentMatch.participantIdentities
        .find((elem) => participant.participantId === elem.participantId)
        return { ...participant, summoner: mapSummoner.player }
      })
      .forEach(player => {
        const { lane, role } = player.timeline;
        players.push(player)
        if (lane === 'TOP') {
          player.role = 'Top';
          top = player;
        } else if (lane === 'JUNGLE') {
          player.role = 'Jungle';
          jungle = player;
        } else if (lane === 'MIDDLE') {
          player.role = 'Mid';
          mid = player;
        } else if (role === 'DUO_CARRY') {
          player.role = 'ADC';
          carry = player;
        } else if (role === 'DUO_SUPPORT') {
          player.role = 'Support';
          support = player;
        }
      })

    // set team bans
    bans = summonerParticipant.teamId === 100
      ? mostRecentMatch.teams[0].bans
      : mostRecentMatch.teams[1].bans

    return ({
      top,
      jungle,
      mid,
      carry,
      support,
      players,
      bans,
    })
  } catch (err) {
    console.error(err)
    throw err;
  }
}

module.exports = analyzeMostRecentMatch;
