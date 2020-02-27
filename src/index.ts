import { Options } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
import app from './app';
import connectionOptions from './ormConfig';

dotenv.config();

const PORT: string | number = process.env.PORT || 4000;
const PLAYGROUND: string = '/playground';
const GRAPHQL_ENDPOINT: string = '/graphql';

const appOption: Options = {
  port: PORT,
  playground: PLAYGROUND,
  endpoint: GRAPHQL_ENDPOINT,
};

const handleAppStart = () => console.log(`Listening on port ${PORT}`);

createConnection(connectionOptions)
  .then(() => {
    app.start(appOption, handleAppStart);
  })
  .catch((error) => console.log(error));
