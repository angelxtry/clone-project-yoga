import { withFilter } from 'graphql-yoga';
import { pubSubContext, subscriptionCtx } from '../../../types/types';

const resolvers = {
  Subscription: {
    NearbyRideSubscription: {
      subscribe: withFilter(
        (_: any, __: any, { pubSub }: pubSubContext) =>
          pubSub.asyncIterator('rideRequest'),
        async (payload: any, __: any, { context }: subscriptionCtx) => {
          const user = context.currentUser;
          const {
            NearbyRideSubscription: { pickUpLat, pickUpLng },
          } = payload;
          const { lastLat: userLastLat, lastLng: userLastLng } = user;
          const result = pickUpLat >= userLastLat - 0.05
            && pickUpLat <= userLastLat + 0.05
            && pickUpLng >= userLastLng - 0.05
            && pickUpLng <= userLastLng + 0.05;
          return result;
        },
      ),
    },
  },
};

export default resolvers;
