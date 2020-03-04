import Place from '@src/entities/Place';
import authResolver from '@src/utils/authResolver';
import { Resolvers } from '@src/types/resolvers';
import { AddPlaceResponse, AddPlaceMutationArgs } from '@src/types/graphql';
import { reqContext } from '@src/types/types';

const resolvers: Resolvers = {
  Mutation: {
    AddPlace: authResolver(
      async (
        _: any,
        args: AddPlaceMutationArgs,
        { req }: reqContext,
      ): Promise<AddPlaceResponse> => {
        const { user } = req;
        try {
          await Place.create({ ...args, user }).save();
          return {
            ok: true,
            error: null,
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
