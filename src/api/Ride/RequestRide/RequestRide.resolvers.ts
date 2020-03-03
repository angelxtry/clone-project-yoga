import User from '../../../entities/User';
import authResolver from '../../../utils/authResolver';
import {
  RequestRideMutationArgs,
  RequestRideResponse,
} from '../../../types/graphql';
import { Resolvers } from '../../../types/resolvers';
import Ride from '../../../entities/Ride';

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: authResolver(
      async (
        _: any,
        args: RequestRideMutationArgs,
        { req, pubSub }: { req: any, pubSub: any },
      ): Promise<RequestRideResponse> => {
        const { user }: { user: User } = req;
        if (!user.isRiding) {
          try {
            const ride = await Ride.create({ ...args, passenger: user }).save();
            pubSub.publish('rideRequest', { NearbyRideSubscription: ride });
            user.isRiding = true;
            user.save();
            return {
              ok: true,
              error: null,
              ride,
            };
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              ride: null,
            };
          }
        }
        return {
          ok: true,
          error: 'Already riding',
          ride: null,
        };
      },
    ),
  },
};

export default resolvers;
