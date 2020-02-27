import { Greeting } from '../../../types/graphql';

const resolvers = {
  Query: {
    sayHello: (): Greeting => ({
      text: 'Hello',
      error: false,
    }),
  },
};

export default resolvers;
