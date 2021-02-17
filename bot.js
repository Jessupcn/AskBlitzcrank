const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const { getSummonerObj, getSummonerMatches, analyzeRecentMatches } = require('./summoner.js');
const { getMatchData } = require('./match.js');
const fetchChampions = require('./utils/fetchChampions');
const championsCache = require('./utils/championCache');

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
});

// eslint-disable-next-line complexity
bot.on('message', async (user, userID, channelID, message, /* evt */) => {
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
          console.log('ANALYSIS:', analysis);

          bot.sendMessage({
            to: channelID,
            message: `blah blah`,
          });
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
});
