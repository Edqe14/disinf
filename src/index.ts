import ora from 'ora';
import chalk from 'chalk';

import Server from '@/modules/server';
import List from '@/modules/list';

const spinner = ora('Loading...');

const oauth = new Server();
oauth.once('listen', () => {
  spinner.stop();
  console.clear();
  console.log(
    chalk.yellow('Please login first to continue:\n'),
    chalk.redBright.underline(oauth.link)
  );

  oauth.once('login', async (access) => {
    console.clear();
    spinner.start('Fetching...');

    const guilds = await oauth.client.getGuilds(access);

    spinner.stop();
    console.clear();

    new List(guilds);
  });
});
