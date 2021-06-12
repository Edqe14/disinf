import express from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import OAuth from 'disco-oauth';
import { Server } from 'http';
import { EventEmitter } from 'events';

export default class OAuthServer extends EventEmitter {
  public app: express.Application;
  public client: OAuth;
  public port: string | number;
  public server: Server;
  public isListening: boolean;

  public code: string;

  constructor() {
    super();

    this.client = new OAuth(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    this.app = express();
    this.configure();
  }

  configure(): void {
    const PORT = (this.port = process.env.PORT || 3000);

    this.app.get('/callback', async (req, res) => {
      const code = <string>req.query.code;
      if (!code) return res.status(400).json({ message: 'Invalid code' });

      this.code = await this.client.getAccess(code);
      this.emit('login', this.code);

      res.send('Login successful. You can close this tab now');
      return this.server.close();
    });

    this.client
      .setScopes('identify', 'guilds')
      .setRedirect('http://localhost:3000/callback');
    this.server = this.app.listen(PORT, () => {
      this.isListening = true;
      this.emit('listen');
    });
  }

  get redirectURI(): string {
    return this.client.redirectURI;
  }

  get link(): string {
    return this.client.auth.link;
  }
}
