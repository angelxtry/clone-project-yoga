import { reqContext } from '@src/types/types';
import authResolver from '@src/utils/authResolver';
import { Resolvers } from '@src/types/resolvers';

const resolvers: Resolvers = {
  Query: {
    GetMyProfile: authResolver(
      async (_: any, __: any, { req }: reqContext) => {
        const { user } = req;
        return {
          ok: true,
          error: null,
          user,
        };
      },
    ),
  },
};

export default resolvers;
