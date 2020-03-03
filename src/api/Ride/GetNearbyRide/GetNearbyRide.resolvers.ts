import { getRepository, Between } from 'typeorm';
import Ride from '../../../entities/Ride';
import User from '../../../entities/User';
import { GetNearbyRideResponse } from '../../../types/graphql';
import authResolver from '../../../utils/authResolver';
import { Resolvers } from '../../../types/resolvers';

const resolvers: Resolvers = {
  Query: {
    GetNearbyRide: authResolver(
      async (
        _: any,
        __: any,
        { req }: { req: any },
      ): Promise<GetNearbyRideResponse> => {
        const { user }: { user: User } = req;
        if (user.isDriving) {
          const { lastLat, lastLng } = user;
          try {
            const ride = await getRepository(Ride).findOne({
              status: 'REQUESTED',
              pickUpLat: Between(lastLat + 0.05, lastLat - 0.05),
              pickUpLng: Between(lastLng + 0.05, lastLng - 0.05),
            }) || null;
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
          ok: false,
          error: 'Already driving',
          ride: null,
        };
      },
    ),
  },
};

export default resolvers;