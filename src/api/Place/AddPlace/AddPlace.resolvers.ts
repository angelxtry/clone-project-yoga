import Place from '../../../entities/Place';
import authResolver from '../../../utils/authResolver';
import { Resolvers } from '../../../types/resolvers';
import { AddPlaceResponse, AddPlaceMutationArgs } from '../../../types/graphql';
import { ReqContext } from '../../../types/types';

const resolvers: Resolvers = {
  Mutation: {
    AddPlace: authResolver(
      async (
        _: any,
        args: AddPlaceMutationArgs,
        { req }: ReqContext,
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
