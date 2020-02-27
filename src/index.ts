import { Options } from 'graphql-yoga';
import app from './app';

const PORT: string | number = process.env.PORT || 4000;
const PLAYGROUND: string = '/playground';
const GRAPHQL_ENDPOINT: string = '/graphql';

const appOption: Options = {
  port: PORT,
  playground: PLAYGROUND,
  endpoint: GRAPHQL_ENDPOINT,
};

const handleAppStart = () => console.log(`Listening on port ${PORT}`);

app.start(appOption, handleAppStart);
