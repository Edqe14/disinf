import chalk from 'chalk';
import readline from 'readline';

export default function getToken(
  rl: readline.Interface
): Promise<string | boolean> {
  return new Promise((resolve) => {
    console.log(chalk.yellow('Please provide a token') + chalk.gray.dim(': '));
    process.stdout.write('\x1B[47m\x1B[37');
    return rl.once('line', (ans) => {
      process.stdout.write('\x1B[39m\x1B[49m');
      resolve(ans);
    });
  });
}
