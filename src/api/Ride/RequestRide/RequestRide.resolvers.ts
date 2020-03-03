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
        { req }: { req: any },
      ): Promise<RequestRideResponse> => {
        const { user }: { user: User } = req;
        try {
          const ride = await Ride.create({ ...args, passenger: user }).save();
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
      },
    ),
  },
};

export default resolvers;
