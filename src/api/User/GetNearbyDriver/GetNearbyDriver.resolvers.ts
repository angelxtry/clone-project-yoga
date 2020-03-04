import { getRepository, Between } from 'typeorm';
import { reqContext } from '@src/types/types';
import authResolver from '@src/utils/authResolver';
import User from '@src/entities/User';
import { Resolvers } from '@src/types/resolvers';
import { GetNearbyDriverResponse } from '@src/types/graphql';

const resolvers: Resolvers = {
  Query: {
    GetNearbyDriver: authResolver(
      async (
        _: any,
        __: any,
        { req }: reqContext,
      ): Promise<GetNearbyDriverResponse> => {
        const { user } = req;
        const { lastLat, lastLng } = user;
        try {
          const drivers: User[] = await getRepository(User).find({
            isDriving: true,
            lastLat: Between(lastLat + 0.05, lastLat - 0.05),
            lastLng: Between(lastLng + 0.05, lastLng - 0.05),
          });
          if (drivers) {
            return {
              ok: true,
              error: null,
              drivers,
            };
          }
          return {
            ok: false,
            error: 'Not found driver',
            drivers: null,
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            drivers: null,
          };
        }
      },
    ),
  },
};

export default resolvers;
