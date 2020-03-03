import Ride from '../../../entities/Ride';
import User from '../../../entities/User';
import authResolver from '../../../utils/authResolver';
import { Resolvers } from '../../../types/resolvers';
import { GetRideResponse, GetRideQueryArgs } from '../../../types/graphql';

const resolvers: Resolvers = {
  Query: {
    GetRide: authResolver(
      async (
        _: any,
        args: GetRideQueryArgs,
        { req }: { req: any },
      ): Promise<GetRideResponse> => {
        const { user }: { user: User } = req;
        try {
          const ride = await Ride.findOne({ id: args.rideId });
          if (ride) {
            if (ride.passengerId === user.id || ride.driverId === user.id) {
              return {
                ok: true,
                error: null,
                ride,
              };
            }
            return {
              ok: false,
              error: 'Not authorized',
              ride: null,
            };
          }
          return {
            ok: false,
            error: 'Ride not found',
            ride: null,
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