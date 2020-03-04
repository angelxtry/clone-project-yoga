import { reqContext } from '@src/types/types';
import { Resolvers } from '@src/types/resolvers';
import { ToggleDrivingModeResponse } from '@src/types/graphql';
import authResolver from '@src/utils/authResolver';

const resolvers: Resolvers = {
  Mutation: {
    ToggleDrivingMode: authResolver(
      async (
        _: any,
        __: any,
        { req }: reqContext,
      ): Promise<ToggleDrivingModeResponse> => {
        const { user } = req;
        try {
          user.isDriving = !user.isDriving;
          await user.save();
          return {
            ok: true,
            error: null,
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
          };
        }
      },
    ),
  },
};

export default resolvers;
