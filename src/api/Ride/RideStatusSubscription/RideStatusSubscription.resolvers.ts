import { withFilter } from 'graphql-yoga';
import User from '../../../entities/User';

const resolvers = {
  Subscription: {
    RideStatusSubscription: {
      subscribe: withFilter(
        (_: any, __: any, { pubSub }) => pubSub.asyncIterator('rideUpdate'),
        async (payload: any, _: any, { context }: { context: any }) => {
          const user: User = context.currentUser;
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
