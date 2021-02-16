const Discord = require('discord.io');
const logger = require('winston');
const axios = require('axios');
const auth = require('./auth.json');
const domain = require('./domain.js');
const { getSummonerObj, getSummonerMatches } = require('./summoner.js');
const { getMatchData } = require('./match.js');

const discordToken = process.env.DISCORD_TOKEN;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true,
});

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', async (user, userID, channelID, message, evt) => {
  console.log('EVENT: ', evt);
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
          message: `Blitzcrank hooked ${args[0]}\n\n...\n\n s/he dead.`,
        });
        break;
      case 'search':
        try {
          const summoner = await getSummonerObj(args[0]);
          console.log('SUMMONER -->', summoner);
          const summonerId = summoner.accountId;

          const matches = await getSummonerMatches(summonerId);
          const last20 = matches.matches.slice(0, 20);
          console.log('last 20: ', last20);
          const match1 = await getMatchData(last20[0].gameId);
          console.log(match1);

          // const promiseArray = matches.matches.map((match) => {
          //   return Promise.resolve(getMatchData(match.gameId));
          // });

          // // console.log(promiseArray[0]);
          // const gameData = Promise.all(
          //   matches.matches.map((match) => {
          //     return getMatchData(match.gameId);
          //   })
          // );
          // console.log('GameData 1', gameData[0]);

          bot.sendMessage({
            to: channelID,
            message: ``,
          });
        } catch (err) {
          console.error(err);

          bot.sendMessage({
            to: channelID,
            message: `We're sorry, something went wrong.`,
          });
        }
        break;
      // Just add any case commands if you want to..
      default:
        break;
    }
  }
});
