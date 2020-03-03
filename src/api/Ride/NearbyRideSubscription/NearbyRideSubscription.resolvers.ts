import { withFilter } from 'graphql-yoga';
import User from '../../../entities/User';

const resolvers = {
  Subscription: {
    NearbyRideSubscription: {
      subscribe: withFilter(
        (_: any, __: any, { pubSub }) => pubSub.asyncIterator('rideRequest'),
        async (payload: any, __: any, { context }: { context: any }) => {
          const user: User = context.currentUser;
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
