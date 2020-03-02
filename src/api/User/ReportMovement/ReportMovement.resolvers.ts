import User from '../../../entities/User';
import { Resolvers } from '../../../types/resolvers';
import {
  ReportMovementResponse,
  ReportMovementMutationArgs,
} from '../../../types/graphql';
import authResolver from '../../../utils/authResolver';

const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: authResolver(
      async (
        _: any,
        args: ReportMovementMutationArgs,
        { req, pubSub }: { req: any; pubSub: any },
      ): Promise<ReportMovementResponse> => {
        const { user }: { user: User } = req;
        const notNull: { [key: string]: number } = {};
        if (args.orientation) {
          notNull.lastOrientation = args.orientation;
        }
        if (args.lat) {
          notNull.lastLat = args.lat;
        }
        if (args.lng) {
          notNull.lastLng = args.lng;
        }
        try {
          await User.update({ id: user.id }, { ...notNull });
          pubSub.publish('driverUpdate', { DriversSubscription: user });
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
