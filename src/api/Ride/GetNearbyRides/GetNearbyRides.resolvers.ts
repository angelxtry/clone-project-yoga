import { getRepository, Between } from 'typeorm';
import Ride from '../../../entities/Ride';
import User from '../../../entities/User';
import { GetNearbyRidesResponse } from '../../../types/graphql';
import authResolver from '../../../utils/authResolver';
import { Resolvers } from '../../../types/resolvers';

const resolvers: Resolvers = {
  Query: {
    GetNearbyRides: authResolver(
      async (
        _: any,
        __: any,
        { req }: { req: any },
      ): Promise<GetNearbyRidesResponse> => {
        const { user }: { user: User } = req;
        if (user.isDriving) {
          const { lastLat, lastLng } = user;
          try {
            const rides = await getRepository(Ride).find({
              status: 'REQUESTED',
              pickUpLat: Between(lastLat + 0.05, lastLat - 0.05),
              pickupLng: Between(lastLng + 0.05, lastLng - 0.05),
            });
            return {
              ok: true,
              error: null,
              rides,
            };
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rides: null,
            };
          }
        }
        return {
          ok: false,
          error: 'Already driving',
          rides: null,
        };
      },
    ),
  },
};

export default resolvers;
