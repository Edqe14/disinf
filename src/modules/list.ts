import { EventEmitter } from 'events';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Guilds, Guild } from 'disco-oauth';
import table from 'tty-table';
import chalk from 'chalk';

// import clamp from '@/utils/clamp';

export default class List extends EventEmitter {
  public guilds: Guilds;
  public names: string[];
  public index = 0;

  public defaultHeader = {
    align: 'left',
    headerAlign: 'center',
    headerColor: 'yellow',
  };

  constructor(guilds: Guilds) {
    super();
    this.guilds = guilds;
    this.names = Object.values(guilds.toJSON()).map((g: Guild) => g.name);

    this.showTable(
      [
        {
          value: 'Name',
          width: '20%',
          formatter(value, i) {
            if (i === this.index) return chalk.bgWhite.black(value);
            return value;
          },
          ...this.defaultHeader,
        },
        {
          value: 'Member Count',
          width: '20%',
          ...this.defaultHeader,
        },
        {
          value: 'Role Count',
          width: '20%',
          ...this.defaultHeader,
        },
        {
          value: 'Info',
          width: '40%',
          ...this.defaultHeader,
        },
      ],
      [
        ['test', ''],
        ['bruh', ''],
      ]
    );
  }

  showTable(
    headers: (string | table.Header | table.Formatter)[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: string[][] | Record<string, any>[],
    footers?: (string | table.Header | table.Formatter)[],
    config?: table.Options
  ): table.Table {
    const tbl = table(headers, body, footers, config);
    console.log(tbl.render());

    return tbl;
  }
}
