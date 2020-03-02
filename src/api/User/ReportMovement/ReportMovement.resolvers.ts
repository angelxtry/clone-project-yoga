import cleanNullArgs from '../../../utils/cleanNummArgs';
import User from '../../../entities/User';
import { Resolvers } from '../../../types/resolvers';
import {
  ReportMovementResponse,
  ReportMovementMutationArgs,
} from '../../../types/graphql';
import authResolver from '../../../utils/authResolver';

const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: authResolver(
      async (
        _: any,
        args: ReportMovementMutationArgs,
        { req }: { req: any },
      ): Promise<ReportMovementResponse> => {
        const { user }: { user: User } = req;
        const notNull = cleanNullArgs(args);
        try {
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
