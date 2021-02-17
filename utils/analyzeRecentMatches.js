/* eslint-disable complexity */
const {
  championsCache,
  getMatchData,
  getSummonerByName,
  getSummonerMatches,
} = require('./')

const analyzeRecentMatches = async (summonerName) => {
  try {
    const summoner = await getSummonerByName(summonerName);
    console.log('SUMMONER', summoner)
    const summonerMatches = await getSummonerMatches(summoner.accountId);

    const numRecentSummonerMatches = summonerMatches.matches.length;
    const championTrend = {};
    const roleTrend = {};

    summonerMatches.matches
      .forEach(game => {
        // champion used in game
        const championUsed = championsCache.get(String(game.champion));

        // update championTrend
        if (championTrend[championUsed.id]) {
          championTrend[championUsed.id]++;
        } else {
          championTrend[championUsed.id] = 1;
        }

        // update roleTrend
        if (game.lane === 'JUNGLE') {
          if (roleTrend.jungle) {
            roleTrend.jungle++;
          } else {
            roleTrend.jungle = 1;
          }
        } else if (game.lane === 'TOP') {
          if (roleTrend.top) {
            roleTrend.top++;
          } else {
            roleTrend.top = 1;
          }
        } else if (game.lane === 'MID') {
          if (roleTrend.mid) {
            roleTrend.mid++;
          } else {
            roleTrend.mid = 1;
          }
        } else if (game.lane === 'BOTTOM') {
          if (game.role === 'DUO_SUPPORT') {
            if (roleTrend.support) {
              roleTrend.support++;
            } else {
              roleTrend.support = 1;
            }
          } else if (game.role === 'DUO_CARRY') {
            if (roleTrend.carry) {
              roleTrend.carry++;
            } else {
              roleTrend.carry = 1;
            }
          }
        }
      })

    /**
     * fetch most recent 15 games for a summoner and
     * analyze in more detail.
     */
    const fetchRecentGames = await Promise.all(
      summonerMatches.matches
      .slice(0, 15)
      .map((match) => getMatchData(match.gameId))
    )
    const recentGames = {
      win: 0,
      loss: 0,
      champions: {},
      mostPlayedRole: [],
    }

    fetchRecentGames.forEach(game => {
      const winningTeam = game.teams[0].win === 'Win' ? 100 : 200;
      const summonerParticipantIdentity = game.participantIdentities
        .find((participant) => summoner.id === participant.player.summonerId)
      const summonerParticipant = game.participants
        .find(elem => elem.participantId === summonerParticipantIdentity.participantId)

      // champion used in game
      const championUsed = championsCache.get(String(summonerParticipant.championId));

      // TODO: role trend

      // track wins/losses
      if (summonerParticipant.teamId === winningTeam) {
        recentGames.win++;

        if (recentGames.champions[championUsed.id]) {
          recentGames.champions[championUsed.id].win++;
        } else {
          recentGames.champions[championUsed.id] = { win: 1, loss: 0 };
        }
      } else {
        recentGames.loss += 1

        if (recentGames.champions[championUsed.id]) {
          recentGames.champions[championUsed.id].loss++;
        } else {
          recentGames.champions[championUsed.id] = {
            win: 0,
            loss: 1
          };
        }
      }
    })

    return ({
      trends: {
        numRecentSummonerMatches,
        championTrend,
        roleTrend
      },
      recentGames
    });
  } catch (err) {
    console.error(err)
    throw err;
  }
}

module.exports = analyzeRecentMatches;
