import { Command } from "./../framework/Command";

const command = new Command('hello', async (message) => {
  await message.reply('World!')
});

export default command;