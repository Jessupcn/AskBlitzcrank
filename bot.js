/* eslint-disable max-statements */
const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');

// local util imports
const {
  analyzeRecentMatches,
  analyzeMostRecentMatch,
  fetchChampions,
} = require('./utils');

// set up tokens from env or local auth file
const discordToken = process.env.DISCORD_TOKEN || auth.token;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
  token: discordToken,
  autorun: true,
});

bot.on('ready', async (evt) => {
  logger.info('Connected', evt);
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')\n\n');
  logger.info('Rocket grabbing champions data ~~~~c');
  const response = await fetchChampions();
  logger.info(response.status === 200 ? 'Champion data ready.' : 'Champion data grab failed.')
  // console.log(championsCache)
});

// eslint-disable-next-line complexity
bot.on('message', async (user, userID, channelID, message, /* evt */) => {
  try {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) === '$') {
      let args = message.substring(1).split(' ');
      const cmd = args[0];
      args = args.splice(1);
      switch (cmd.toLowerCase()) {
        case 'commands':
          bot.sendMessage({
            to: channelID,
            message: `hello\nsearch {summonerName}\nhook {user}`,
          });
          break;
        case 'hello':
          bot.sendMessage({
            to: channelID,
            message: 'Fired up!',
          });
          break;
        case 'hook':
          bot.sendMessage({
            to: channelID,
            message: `Blitzcrank hooked ~-~-~-~-~-~c ${args[0]}\n\n...\n\n s/he dead.`,
          });
          break;
        case 'refetch':
          try {
            const response = await fetchChampions()
            if (response.status === 200) {
              bot.sendMessage({
                to: channelID,
                message: `Champion Data Grabbed`,
              });
            } else {
              bot.sendMessage({
                to: channelID,
                message: `Rocket Grab Missed`,
              });
            }
          } catch (err) {
            console.error(err)
          }
          break;
        case 'search':
          try {
            if (!args[0]) {
              bot.sendMessage({
                to: channelID,
                message: `Please enter summoner name`,
              });
              break;
            }

            bot.sendMessage({
              to: channelID,
              message: `Grabbing ${args[0]}`,
            });

            const analysis = await analyzeRecentMatches(args[0])
            let responseMessage = ''

            const {trends, recentGames} = analysis;
            console.log('TRENDS!!', trends);

            if (!trends.numRecentSummonerMatches) {
              responseMessage = 'No recent games found.'
            } else {
              responseMessage += 'MOST RECENT GAMES:\n'
              responseMessage += `${recentGames.win} wins - ${recentGames.loss} losses\n`
              responseMessage += recentGames.mostPlayedRole.length ? `Most Played Role: ${recentGames.mostPlayedRole.join(', ')}\n` : ''
              responseMessage += '\n'

              const champions = Object.entries(recentGames.champions);
              champions
                .sort((champion1, champion2) => (champion2[1].win + champion2[1].loss) - (champion1[1].win + champion1[1].loss))
                .forEach(champion => {
                  const championName = champion[0];
                  const winLoss = champion[1];
                  responseMessage += `${championName}: ${winLoss.win} win${!winLoss.win || winLoss.win > 1 ? 's' : ''} - ${winLoss.loss} loss${!winLoss.loss || winLoss.loss > 1 ? 'es' : ''}\n`
                })
                responseMessage += '~-~-~-~-~-~-~-~-~-~-~-~-c'
            }

            bot.sendMessage({
              to: channelID,
              message: responseMessage,
            });
          } catch (err) {
            throw err;
          }
          break;
        case 'mostRecent':
          try {
            const response = await analyzeMostRecentMatch();
          } catch (err) {
            throw err
          }
          break;
        // Just add any case commands if you want to..
        default:
          bot.sendMessage({
            to: channelID,
            message: `Use $commands to read Blitzcrank's manual.`,
          });
          break;
      }
    }
  } catch (err) {
    console.error(err);
    const errorMessage = err.response.status === 429
      ? 'Please wait a minute, rate limit exceeded.'
      : 'Something went wrong.'

    bot.sendMessage({
      to: channelID,
      message: errorMessage,
    });
  }
});
