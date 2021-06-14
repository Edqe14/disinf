import { EventEmitter } from 'events';
import { Client, Guild, Invite } from 'discord.js';
import chalk from 'chalk';
import columnify from 'columnify';
import readline from 'readline';
import fs from 'fs/promises';
import path from 'path';

import clamp from '@/utils/clamp';
import { TableColumn } from '@/types/list';
import { Key, Keybind } from '@/types/keybind';

export default class List extends EventEmitter {
  public client: Client;
  public index = 0;
  public keybinds: Record<string, Keybind> = {};

  public leaving = false;
  public showingHelp = false;

  constructor(client: Client) {
    super();

    this.client = client;

    (async () => {
      await this.loadKeybinds();
      this.listenKeypress();
      this.render();
    })();
  }

  async loadKeybinds(): Promise<void> {
    const keybindsPath = path.resolve(__dirname, 'keybinds');
    if (!keybindsPath) throw new Error('Missing keybinds path');

    (await fs.readdir(keybindsPath))
      .filter((f) => f.split('.').pop() === 'js' || f.split('.').pop() === 'ts')
      .forEach(async (f) => {
        const keybind: Keybind = await import(path.resolve(keybindsPath, f));
        if (keybind) this.keybinds[keybind.name] = keybind;
      });
  }

  listenKeypress(): void {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('keypress', async (_, key: Key) => {
      if (key && key.ctrl && key.name === 'c') {
        console.clear();
        console.log(chalk.yellow.dim.bold('Thanks for using this program!'));
        return process.exit();
      }

      const pressed = this.keybinds[key.name];
      if (this.showingHelp && pressed?.name !== 'escape') return;
      if (pressed && pressed.validator.call(this, key))
        await pressed.execute.call(this);
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
      headingTransform: (val) => chalk.gray.dim.bold(val.toUpperCase()),
    });

    console.log(list);
    console.log(
      `${chalk.dim.bold('Press')} ${this.colorizeInfo(
        'CTRL + H'
      )} ${chalk.bold.dim('to show help')}`
    );
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
