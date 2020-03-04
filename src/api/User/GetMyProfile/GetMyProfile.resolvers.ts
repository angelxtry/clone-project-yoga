import { reqContext } from '../../../types/types';
import authResolver from '../../../utils/authResolver';
import { Resolvers } from '../../../types/resolvers';

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
