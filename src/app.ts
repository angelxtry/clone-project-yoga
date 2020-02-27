import { GraphQLServer } from 'graphql-yoga';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import schema from './schema';

class App {
  public app: GraphQLServer;

  constructor() {
    this.app = new GraphQLServer({ schema });
    this.middlewares();
  }

  private middlewares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(helmet());
    this.app.express.use(logger('dev'));
  };
}

export default new App().app;
