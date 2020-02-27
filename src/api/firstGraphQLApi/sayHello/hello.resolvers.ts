import { Greeting, SayHelloQueryArgs } from '../../../types/graphql';

const resolvers = {
  Query: {
    sayHello: (_: any, args: SayHelloQueryArgs): Greeting => ({
      text: `Hello ${args.name}`,
      error: false,
    }),
  },
};

export default resolvers;
