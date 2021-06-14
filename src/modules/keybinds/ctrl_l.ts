import { Keybind } from '@/types/keybind';

export = {
  id: 'CTRL + L',
  name: 'l',
  description: 'Leave the selected server',
  validator: (key) => key.ctrl,
  async execute() {
    const left = await this.leaveGuild();
    if (left === null || left === undefined)
      return console.log(
        `Are you sure? Press ${this.colorizeInfo('CTRL + L')} again to continue`
      );

    if (!left)
      return console.log(this.colorizeError('Failed to leave the guild'));
    return this.update(this.index);
  },
} as Keybind;
