import 'make-promises-safe';
import * as Dotenv from 'dotenv';

import { join } from 'path'
import Bot, { BotOptions } from './framework/Bot';

Dotenv.config();

const options: BotOptions = {
  token: process.env.DISCORD_TOKEN,
  commands: {
    prefix: '!',
    path: join(__dirname, 'commands'),
  }
}

const bot = new Bot(options);

bot.start().then(() => {
  bot.logger.info('Bot started');
});
