import { GraphQLServer, PubSub } from 'graphql-yoga';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import { NextFunction, Response } from 'express';
import schema from './schema';
import decodeJWT from './utils/decodeJWT';

class App {
  public app: GraphQLServer;

  public pubSub: any;

  constructor() {
    this.pubSub = new PubSub();
    this.pubSub.ee.setMaxListeners(99);
    this.app = new GraphQLServer({
      schema,
      context: (req) => {
        // console.log(req.connection.context.currentUser);
        const { connection: { context = null } = {} } = req;
        return {
          req: req.request,
          pubSub: this.pubSub,
          context,
        };
      },
    });
    this.middlewares();
  }

  private middlewares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(helmet());
    this.app.express.use(logger('dev'));
    this.app.express.use(this.auth);
  };

  private auth = async (
    req: any,
    _: Response,
    next: NextFunction,
  ): Promise<void> => {
    const token = req.get('X-JWT');
    if (token) {
      const user = await decodeJWT(token);
      if (user) {
        req.user = user;
      } else {
        req.user = undefined;
      }
    }
    next();
  };
}

export default new App().app;
