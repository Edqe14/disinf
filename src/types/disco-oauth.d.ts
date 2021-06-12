declare module 'disco-oauth' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export default class OAuth {
    constructor(id: string, secret: string);
    redirectURI: string;
    auth: Auth;
    setScopes(...scopes: string[]): OAuth;
    setRedirect(link: string): OAuth;
    getAccess(code: string): Promise<string>;
    getGuilds(access: string): Promise<Guilds>;
  }

  export interface Guilds extends Map<string, Guild> {
    toJSON(): { [key: string]: Guild };
  }

  export interface Guild {
    id: string;
    name: string;
    toJSON(): Guild;
  }

  export interface Auth {
    link: string;
    state: string;
  }
}
