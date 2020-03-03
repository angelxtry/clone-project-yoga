import { withFilter } from 'graphql-yoga';
import User from '../../../entities/User';

const resolvers = {
  Subscription: {
    DriversSubscription: {
      subscribe: withFilter(
        (_: any, __: any, { pubSub }: { pubSub: any }) =>
          pubSub.asyncIterator('driverUpdate'),
        async (
          payload: any,
          _: any,
          { context }: { context: any },
        ): Promise<boolean> => {
          // console.log('This is coming from ReportMovement Resolver', payload);
          // console.log(context);
          const user: User = context.currentUser;
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
