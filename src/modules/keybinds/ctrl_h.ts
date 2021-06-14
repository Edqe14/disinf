import { Keybind } from '@/types/keybind';
import columnify from 'columnify';
import chalk from 'chalk';

export = {
  id: 'CTRL + H',
  name: 'backspace',
  description: 'Show this table',
  validator: (key) => key.sequence === '\b',
  async execute() {
    if (this.showingHelp) return;
    this.showingHelp = true;

    console.clear();
    const columns = Object.values(this.keybinds)
      .filter((k) => !k.hidden)
      .map((k) => ({
        command: k.id,
        description: k.description,
      }));

    console.log(
      columnify(columns, {
        minWidth: 15,
        columnSplitter: ' | ',
        headingTransform: (val) => chalk.gray.dim.bold(val.toUpperCase()),
      })
    );
    console.log(
      `${chalk.dim.bold('Press')} ${this.colorizeInfo(
        'ESCAPE'
      )} ${chalk.bold.dim('to go back')}`
    );
  },
} as Keybind;
