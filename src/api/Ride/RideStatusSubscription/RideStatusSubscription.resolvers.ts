import { withFilter } from 'graphql-yoga';
import { pubSubContext, subscriptionCtx, Payload } from '@src/types/types';
import Ride from '@src/entities/Ride';

const resolvers = {
  Subscription: {
    RideStatusSubscription: {
      subscribe: withFilter(
        (_: any, __: any, { pubSub }: pubSubContext) =>
          pubSub.asyncIterator('rideUpdate'),
        async (
          payload: Payload<Ride>,
          _: any,
          { context }: subscriptionCtx,
        ) => {
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
