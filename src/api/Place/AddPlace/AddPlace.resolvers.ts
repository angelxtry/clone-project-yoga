import Place from '../../../entities/Place';
import User from '../../../entities/User';
import authResolver from '../../../utils/authResolver';
import { Resolvers } from '../../../types/resolvers';
import { AddPlaceResponse, AddPlaceMutationArgs } from '../../../types/graphql';

const resolvers: Resolvers = {
  Mutation: {
    AddPlace: authResolver(
      async (
        _: any,
        args: AddPlaceMutationArgs,
        { req }: { req: any },
      ): Promise<AddPlaceResponse> => {
        const { user }: { user: User } = req;
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
