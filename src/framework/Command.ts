import { Message } from "discord.js";

class Command {

  constructor (public name: string, public handler: (message: Message) => void) {

  }

}

export { Command }