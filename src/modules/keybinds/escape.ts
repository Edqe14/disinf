import { Keybind } from '@/types/keybind';

export = {
  id: 'ESCAPE',
  name: 'escape',
  hidden: true,
  validator: () => true,
  async execute() {
    if (!this.showingHelp) return;
    this.showingHelp = false;

    this.update(this.index);
  },
} as Keybind;
