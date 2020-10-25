import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import pino from 'pino';
import { Command } from './Command';

export interface ICommand {
  path: string;
  prefix: string;
}

export interface BotOptions {
  token?: string;

  commands: ICommand;
}

export default class Bot {
  private token?: string;
  private _client: Client | null;

  public logger: pino.Logger;

  private commandsPath: string;
  private commandsPrefix: string;
  private commands: Array<Command> = [];

  public constructor(options: BotOptions) {
    this.token = options.token;
    this._client = null;
    this.logger = pino();

    this.commandsPath = options.commands.path;
    this.commandsPrefix = options.commands.prefix
  }

  public get client(): Client {
    if (!this._client) {
      throw new Error('Bot was not started');
    }
    return this._client;
  }

  public async start(): Promise<void> {
    if (this._client) {
      throw new Error('Bot can only be started once');
    }
    this._client = new Client();
    try {
      await this.client.login(this.token);
    } catch (error) {
      this._client = null;
      throw error;
    }

    this.handleCommand();
  }

  public stop(): void {
    if (!this._client) {
      throw new Error('Bot was not started');
    }
    this._client.destroy();
    this._client = null;
  }

  private handleCommand(): void {
    const files = readdirSync(this.commandsPath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    this.commands = files.map((fileName: string) => require(`${this.commandsPath}/${fileName}`).default)

    this.client.on('message', async (event) => {
      if (!event.content.startsWith(this.commandsPrefix)) {
        return;
      }

      const command = event.content.substring(1, event.content.length);
      const execute = this.commands.find((cmd) => cmd.name === command);
      await execute?.handler(event);
    })
  }
}
