const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const discordToken = process.env.DISCORD_TOKEN;

console.log(process.env.LOL_API_KEY);
console.log(discordToken);
console.log(auth.token);

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

bot.on('message', function (user, userID, channelID, message, evt) {
  console.log('--> ', evt);
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) === '!') {
    let args = message.substring(1).split(' ');
    const cmd = args[0];

    args = args.splice(1);
    console.log(args);
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
          message: `Blitzcrank hooked ${args[0]}\n\n...\n\n he dead.`,
        });
        break;
      // Just add any case commands if you want to..
      default:
        break;
    }
  }
});
