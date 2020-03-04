import 'module-alias/register';
import { Options } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
import app from './app';
import connectionOptions from './ormConfig';
import decodeJWT from './utils/decodeJWT';

dotenv.config();

const PORT: string | number = process.env.PORT || 4000;
const PLAYGROUND: string = '/playground';
const GRAPHQL_ENDPOINT: string = '/graphql';
const SUBSCRIPTION_ENDPOINT: string = '/subscription';

const appOption: Options = {
  port: PORT,
  playground: PLAYGROUND,
  endpoint: GRAPHQL_ENDPOINT,
  subscriptions: {
    path: SUBSCRIPTION_ENDPOINT,
    onConnect: async (connectParams: any) => {
      console.log(connectParams);
      const token = connectParams['X-JWT'];
      if (token) {
        const user = await decodeJWT(token);
        if (user) {
          return {
            currentUser: user,
          };
        }
      }
      throw new Error('No JWT. Cant subscribe');
    },
  },
};

const handleAppStart = () => console.log(`Listening on port ${PORT}`);

createConnection(connectionOptions)
  .then(() => {
    app.start(appOption, handleAppStart);
  })
  .catch((error) => console.log(error));
