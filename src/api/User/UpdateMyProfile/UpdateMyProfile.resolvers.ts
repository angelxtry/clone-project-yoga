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
        { req }: { req: any },
      ): Promise<UpdateMyProfileResponse> => {
        const { user }: { user: User } = req;
        const notNull: { [key: string]: string | number } = {};
        Object.keys(args).forEach((property) => {
          if ((args as any)[property] !== null) {
            notNull[property] = (args as any)[property];
          }
        });
        try {
          if (notNull.password !== null) {
            user.password = notNull.password as string;
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
