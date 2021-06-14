import { Keybind } from '@/types/keybind';

export = {
  id: 'UP',
  name: 'up',
  hidden: true,
  validator: () => true,
  execute() {
    this.update(this.index - 1);
  },
} as Keybind;
