import { ReqContext } from '../../../types/types';
import User from '../../../entities/User';
import { GetMyPlaceResponse } from '../../../types/graphql';
import authResolver from '../../../utils/authResolver';
import { Resolvers } from '../../../types/resolvers';

const resolvers: Resolvers = {
  Query: {
    GetMyPlace: authResolver(
      async (
        _: any,
        __: any,
        { req }: ReqContext,
      ): Promise<GetMyPlaceResponse> => {
        try {
          const user = await User.findOne(
            { id: req.user.id },
            { relations: ['places'] },
          );
          if (user) {
            return {
              ok: true,
              error: null,
              places: user.places,
            };
          }
          return {
            ok: false,
            error: 'User not found',
            places: null,
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            places: null,
          };
        }
      },
    ),
  },
};

export default resolvers;
