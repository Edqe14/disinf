import { Keybind } from '@/types/keybind';

export = {
  id: 'DOWN',
  name: 'down',
  hidden: true,
  validator: () => true,
  execute() {
    this.update(this.index + 1);
  },
} as Keybind;
