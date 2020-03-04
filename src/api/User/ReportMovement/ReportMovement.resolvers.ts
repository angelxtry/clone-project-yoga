import { ReqPubSubCtx } from '@src/types/types';
import cleanNullArgs from '@src/utils/cleanNummArgs';
import User from '@src/entities/User';
import { Resolvers } from '@src/types/resolvers';
import {
  ReportMovementResponse,
  ReportMovementMutationArgs,
} from '@src/types/graphql';
import authResolver from '@src/utils/authResolver';

const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: authResolver(
      async (
        _: any,
        args: ReportMovementMutationArgs,
        { req, pubSub }: ReqPubSubCtx,
      ): Promise<ReportMovementResponse> => {
        const { user } = req;
        const notNull = cleanNullArgs(args);
        try {
          await User.update({ id: user.id }, { ...notNull });
          const updateUser = await User.findOne({ id: user.id });
          pubSub.publish('driverUpdate', { DriversSubscription: updateUser });
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
