import authResolver from '../../../utils/authResolver';
import Place from '../../../entities/Place';
import User from '../../../entities/User';
import {
  DeletePlaceResponse,
  DeletePlaceMutationArgs,
} from '../../../types/graphql';
import { Resolvers } from '../../../types/resolvers';

const resolvers: Resolvers = {
  Mutation: {
    DeletePlace: authResolver(
      async (
        _: any,
        args: DeletePlaceMutationArgs,
        { req }: { req: any },
      ): Promise<DeletePlaceResponse> => {
        const { user }: { user: User } = req;
        try {
          const place = await Place.findOne({ id: args.placeId });
          if (place) {
            if (place.userId === user.id) {
              place.remove();
              return {
                ok: true,
                error: null,
              };
            }
            return {
              ok: false,
              error: 'Not Authorized',
            };
          }
          return {
            ok: false,
            error: 'Place not found',
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
          };
        }
      },
    ),
  },
};

export default resolvers;