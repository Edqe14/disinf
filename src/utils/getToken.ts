import chalk from 'chalk';
import readline from 'readline';

export default function getToken(
  rl: readline.Interface
): Promise<string | boolean> {
  return new Promise((resolve) => {
    console.log(chalk.yellow('Please provide a token') + chalk.gray.dim(': '));
    return rl.once('line', (ans) => resolve(ans));
  });
}
