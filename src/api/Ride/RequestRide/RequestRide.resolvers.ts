import { ReqPubSubCtx } from '@src/types/types';
import authResolver from '@src/utils/authResolver';
import {
  RequestRideMutationArgs,
  RequestRideResponse,
} from '@src/types/graphql';
import { Resolvers } from '@src/types/resolvers';
import Ride from '@src/entities/Ride';

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: authResolver(
      async (
        _: any,
        args: RequestRideMutationArgs,
        { req, pubSub }: ReqPubSubCtx,
      ): Promise<RequestRideResponse> => {
        const { user } = req;
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
