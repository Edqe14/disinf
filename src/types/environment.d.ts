declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    CLIENT_ID: string;
    CLIENT_SECRET: string;
  }
}
