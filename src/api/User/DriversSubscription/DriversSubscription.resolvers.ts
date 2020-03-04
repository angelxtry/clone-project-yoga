import { withFilter } from 'graphql-yoga';
import User from '../../../entities/User';
import { pubSubContext, subscriptionCtx, Payload } from '../../../types/types';

const resolvers = {
  Subscription: {
    DriversSubscription: {
      subscribe: withFilter(
        (_: any, __: any, { pubSub }: pubSubContext) =>
          pubSub.asyncIterator('driverUpdate'),
        async (
          payload: Payload<User>,
          _: any,
          { context }: subscriptionCtx,
        ): Promise<boolean> => {
          const user = context.currentUser;
          const { lastLat: userLastLat, lastLng: userLastLng } = user;
          const {
            DriversSubscription: {
              lastLat: driverLastLat,
              lastLng: driverLastLng,
            },
          } = payload;
          return (
            driverLastLat >= userLastLat - 0.05
            && driverLastLat <= userLastLat + 0.05
            && driverLastLng >= userLastLng - 0.05
            && driverLastLng <= userLastLng + 0.05
          );
        },
      ),
    },
  },
};

export default resolvers;
