import ora from 'ora';
import chalk from 'chalk';
import { Client } from 'discord.js';
import readline from 'readline';

import List from '@/modules/list';
import getToken from '@/utils/getToken';
import process from 'process';

const bot = new Client();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  let status = false;

  while (!status) {
    const token = await getToken(rl);
    console.clear();

    const spinner = ora('Logging in...').start();

    status = await bot
      .login(<string>token)
      .then(() => Boolean(spinner.stop()))
      .catch((e) => {
        spinner.stop();
        console.error(chalk.red.bold(e.message));
        return false;
      });
  }

  const spinner = ora('Loading...').start();
  bot.once('ready', () => {
    rl.close();
    spinner.stop();
    console.clear();

    if (process.env.NODE_ENV !== 'production')
      console.log(
        chalk.white.dim(
          // @ts-expect-error Check for remaining session restarts
          `[DEV] Restarts left: ${bot.ws.sessionStartLimit.remaining}\n`
        )
      );

    new List(bot);
  });
})();
