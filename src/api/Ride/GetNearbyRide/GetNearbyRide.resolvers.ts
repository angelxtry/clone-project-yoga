import { getRepository, Between } from 'typeorm';
import { reqContext } from '@src/types/types';
import Ride from '@src/entities/Ride';
import { GetNearbyRideResponse } from '@src/types/graphql';
import authResolver from '@src/utils/authResolver';
import { Resolvers } from '@src/types/resolvers';

const resolvers: Resolvers = {
  Query: {
    GetNearbyRide: authResolver(
      async (
        _: any,
        __: any,
        { req }: reqContext,
      ): Promise<GetNearbyRideResponse> => {
        const { user } = req;
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
