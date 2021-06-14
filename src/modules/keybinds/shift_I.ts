import { Keybind } from '@/types/keybind';

export = {
  id: 'SHIFT + I',
  name: 'i',
  description: 'Fetch an invite to the selected server',
  validator: (key) => key.sequence === 'I' && key.shift,
  async execute() {
    try {
      const invite = await this.getInvite();
      return console.log(`Invite ${this.colorizeInfo(invite.url)}`);
    } catch {
      return console.error(this.colorizeError('Failed to fetch an invite'));
    }
  },
} as Keybind;
