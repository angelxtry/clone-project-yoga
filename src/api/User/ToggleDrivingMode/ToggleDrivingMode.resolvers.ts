import { Resolvers } from '../../../types/resolvers';
import { ToggleDrivingModeResponse } from '../../../types/graphql';
import User from '../../../entities/User';
import authResolver from '../../../utils/authResolver';

const resolvers: Resolvers = {
  Mutation: {
    ToggleDrivingMode: authResolver(
      async (
        _: any,
        __: any,
        { req }: { req: any },
      ): Promise<ToggleDrivingModeResponse> => {
        const { user }: { user: User } = req;
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
