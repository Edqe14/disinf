import { EventEmitter } from 'events';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Guilds, Guild } from 'disco-oauth';
import table from 'tty-table';

import clamp from '@/utils/clamp';

export default class List extends EventEmitter {
  public guilds: Guilds;
  public names: string[];
  public index = 0;

  public header = [
    {
      value: 'Name',
      align: 'left',
      width: '20%',
      headerColor: 'yellow',
    },
    {
      value: 'Info',
      align: 'left',
      width: '80%',
      headerColor: 'yellow',
      formatter(value: string, index: number): string {
        console.log(index);
        if (index === this.index) value = this.style(value, 'bgWhite', 'black');
        return value;
      },
    },
  ];

  constructor(guilds: Guilds) {
    super();
    this.guilds = guilds;
    this.names = Object.values(guilds.toJSON()).map((g: Guild) => g.name);

    this.showTable();
  }

  showTable() {
    table(this.header);
  }
}
