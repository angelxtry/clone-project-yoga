import createJWT from '@src/utils/createJWT';
import { Resolvers } from '@src/types/resolvers';
import {
  FacebookConnectMutationArgs,
  FacebookConnectResponse,
} from '@src/types/graphql';
import User from '@src/entities/User';

const resolvers: Resolvers = {
  Mutation: {
    FacebookConnect: async (
      _,
      args: FacebookConnectMutationArgs,
    ): Promise<FacebookConnectResponse> => {
      const { fbId } = args;
      try {
        const existingUser = await User.findOne({ fbId });
        if (existingUser) {
          const token = createJWT(existingUser.id);
          return {
            ok: true,
            error: null,
            token,
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }

      try {
        const newUser = await User.create({
          ...args,
          // eslint-disable-next-line max-len
          profilePhoto: `https://graph.facebook.com/${fbId}/picture?type=square`,
        }).save();
        const token = createJWT(newUser.id);
        return {
          ok: true,
          error: null,
          token,
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }
    },
  },
};

export default resolvers;
