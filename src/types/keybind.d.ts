import List from '@/modules/list';

export interface Keybind {
  id: string;
  description?: string;
  name: string;
  hidden?: boolean;
  validator(this: List, key: Key): boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(this: List): any;
}

export interface Key {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
}
