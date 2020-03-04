import { withFilter } from 'graphql-yoga';
import { pubSubContext, subscriptionCtx } from '../../../types/types';

const resolvers = {
  Subscription: {
    RideStatusSubscription: {
      subscribe: withFilter(
        (_: any, __: any, { pubSub }: pubSubContext) =>
          pubSub.asyncIterator('rideUpdate'),
        async (payload: any, _: any, { context }: subscriptionCtx) => {
          const user = context.currentUser;
          const {
            RideStatusSubscription: { driverId, passengerId },
          } = payload;
          return user.id === driverId || user.id === passengerId;
        },
      ),
    },
  },
};

export default resolvers;
