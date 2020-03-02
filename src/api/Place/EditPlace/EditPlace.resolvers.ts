import Place from '../../../entities/Place';
import cleanNullArgs from '../../../utils/cleanNummArgs';
import authResolver from '../../../utils/authResolver';
import User from '../../../entities/User';
import {
  EditPlaceResponse,
  EditPlaceMutationArgs,
} from '../../../types/graphql';
import { Resolvers } from '../../../types/resolvers';

const resolvers: Resolvers = {
  Mutation: {
    EditPlace: authResolver(
      async (
        _: any,
        args: EditPlaceMutationArgs,
        { req }: { req: any },
      ): Promise<EditPlaceResponse> => {
        const { user }: { user: User } = req;
        try {
          const place = await Place.findOne({ id: args.placeId });
          if (place) {
            if (place.userId === user.id) {
              const notNull = cleanNullArgs(args);
              await Place.update({ id: args.placeId }, { ...notNull });
              return {
                ok: true,
                error: null,
              };
            }
            return {
              ok: false,
              error: 'Not authorized',
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