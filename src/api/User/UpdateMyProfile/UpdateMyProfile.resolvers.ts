import { reqContext } from '@src/types/types';
import cleanNullArgs from '@src/utils/cleanNummArgs';
import authResolver from '@src/utils/authResolver';
import User from '@src/entities/User';
import { Resolvers } from '@src/types/resolvers';
import {
  UpdateMyProfileResponse,
  UpdateMyProfileMutationArgs,
} from '@src/types/graphql';

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: authResolver(
      async (
        _: any,
        args: UpdateMyProfileMutationArgs,
        { req }: reqContext,
      ): Promise<UpdateMyProfileResponse> => {
        const { user } = req;
        const notNull: any = cleanNullArgs(args);
        try {
          if (args.password !== null) {
            user.password = args.password;
            await user.save();
            delete notNull.password;
          }
          await User.update({ id: user.id }, { ...notNull });
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
