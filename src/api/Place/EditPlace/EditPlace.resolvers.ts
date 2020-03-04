import { reqContext } from '@src/types/types';
import Place from '@src/entities/Place';
import cleanNullArgs from '@src/utils/cleanNummArgs';
import authResolver from '@src/utils/authResolver';
import {
  EditPlaceResponse,
  EditPlaceMutationArgs,
} from '@src/types/graphql';
import { Resolvers } from '@src/types/resolvers';

const resolvers: Resolvers = {
  Mutation: {
    EditPlace: authResolver(
      async (
        _: any,
        args: EditPlaceMutationArgs,
        { req }: reqContext,
      ): Promise<EditPlaceResponse> => {
        const { user } = req;
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
