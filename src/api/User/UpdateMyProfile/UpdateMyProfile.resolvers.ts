import { reqContext } from '../../../types/types';
import cleanNullArgs from '../../../utils/cleanNummArgs';
import authResolver from '../../../utils/authResolver';
import User from '../../../entities/User';
import { Resolvers } from '../../../types/resolvers';
import {
  UpdateMyProfileResponse,
  UpdateMyProfileMutationArgs,
} from '../../../types/graphql';

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
            user.password = args.password as string;
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
