import { EventEmitter } from 'events';
import { Client, Guild, Invite } from 'discord.js';
import chalk from 'chalk';
import columnify from 'columnify';
import readline from 'readline';

import clamp from '@/utils/clamp';

interface TableColumn {
  name?: string;
  info?: string;
}

export default class List extends EventEmitter {
  public client: Client;
  public index = 0;

  private leaving = false;
  private showingHelp = false;

  constructor(client: Client) {
    super();

    this.client = client;

    this.listenKeypress();
    this.render();
  }

  listenKeypress(): void {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('keypress', async (_, key) => {
      if (key && key.ctrl && key.name === 'c') {
        console.clear();
        return process.exit();
      }

      switch (key.name) {
        case 'up':
          return this.update(this.index - 1);

        case 'down':
          return this.update(this.index + 1);

        case 'tab': {
          try {
            const invite = await this.getInvite();
            return console.log(`Invite ${this.colorizeInfo(invite.url)}`);
          } catch {
            return console.error(
              this.colorizeError('Failed to fetch an invite')
            );
          }
        }

        case 'l': {
          if (!key.ctrl) return;

          const left = await this.leaveGuild();
          if (left === null || left === undefined)
            return console.log(
              `Are you sure? Press ${this.colorizeInfo(
                'CTRL + L'
              )} again to continue`
            );

          if (!left)
            return console.log(this.colorizeError('Failed to leave the guild'));
          return this.update(this.index);
        }
      }
    });
  }

  update(index: number): void {
    this.leaving = false;

    if (this.showingHelp) return;
    this.index = clamp(index, 0, this.client.guilds.cache.size - 1);

    console.clear();
    this.render();
  }

  render(): void {
    const start = clamp(this.index, 0, this.client.guilds.cache.size - 10);
    const end = clamp(this.index + 10, 0, this.client.guilds.cache.size);

    const guildNames = this.client.guilds.cache
      .array()
      .map((g, i) => ({
        name: i === this.index ? chalk.bgWhite.black(g.name) : g.name,
      }))
      .slice(start, end);

    const list = columnify(this.buildInfo(guildNames), {
      minWidth: 15,
      columnSplitter: ' | ',
    });

    console.log(list);
  }

  buildInfo(names: TableColumn[]): TableColumn[] {
    const guild = this.guild;
    if (!guild) return names;

    const infos = [
      `Name ${this.colorizeInfo(`${guild?.name} (${guild?.id})`)}`,
      `Owner ${this.colorizeInfo(
        `${guild?.owner?.user?.tag} (${guild?.ownerID})`
      )}`,
      `Total Member ${this.colorizeInfo(guild?.memberCount?.toString())}`,
      `Humans ${this.colorizeInfo(
        guild?.members?.cache?.filter((m) => !m.user.bot)?.size?.toString()
      )}\tBots ${this.colorizeInfo(
        guild?.members?.cache?.filter((m) => m.user.bot)?.size?.toString()
      )}`,
      `Total Roles ${this.colorizeInfo(guild?.roles?.cache?.size?.toString())}`,
    ];

    infos.forEach((t, i) => {
      if (!names[i]) names[i] = {};
      names[i].info = t;
    });
    return names;
  }

  async getInvite(): Promise<Invite> {
    const guild = this.guild;
    const invites = await guild.fetchInvites();

    return invites.first();
  }

  async leaveGuild(): Promise<boolean | null> {
    if (!this.leaving) {
      this.leaving = true;
      return;
    }

    this.leaving = false;
    try {
      await this.guild.leave();
      return true;
    } catch {
      return false;
    }
  }

  colorizeInfo(str: string): string {
    return chalk.yellow.dim.bold(str);
  }

  colorizeError(str: string): string {
    return chalk.red.dim(str);
  }

  colorizeSuccess(str: string): string {
    return chalk.green.dim(str);
  }

  get guild(): Guild {
    return this.client.guilds.cache.array()[this.index];
  }
}
