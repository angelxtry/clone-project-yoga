import Verification from '../../../entities/Verification';
import User from '../../../entities/User';
import {
  CompleteEmailVerificationResponse,
  CompleteEmailVerificationMutationArgs,
} from '../../../types/graphql';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers: Resolvers = {
  Mutation: {
    CompleteEmailVerification: authResolver(
      async (
        _: any,
        args: CompleteEmailVerificationMutationArgs,
        { req }: { req: any },
      ): Promise<CompleteEmailVerificationResponse> => {
        const { user }: { user: User } = req;
        const { key } = args;
        if (user.email) {
          try {
            const verification = await Verification.findOne({
              payload: user.email,
              key,
            });
            if (verification) {
              user.verifiedEmail = true;
              user.save();
              return {
                ok: true,
                error: null,
              };
            }
            return {
              ok: false,
              error: 'Not verifiy email',
            };
          } catch (error) {
            return {
              ok: false,
              error: error.message,
            };
          }
        }
        return {
          ok: false,
          error: 'No email to verify',
        };
      },
    ),
  },
};

export default resolvers;
