import sendVerificationEmail from '../../../utils/sendEmail';
import Verification from '../../../entities/Verification';
import { Resolvers } from '../../../types/resolvers';
import { RequestEmailVerificationResponse } from '../../../types/graphql';
import authResolver from '../../../utils/authResolver';
import User from '../../../entities/User';

const resolvers: Resolvers = {
  Mutation: {
    RequestEmailVerification: authResolver(
      async (
        _: any,
        __: any,
        { req }: { req: any },
      ): Promise<RequestEmailVerificationResponse> => {
        const { user }: { user: User } = req;
        if (user.email && !user.verifiedEmail) {
          try {
            const verification = await Verification.findOne({
              payload: user.email,
            });
            if (verification) {
              verification.remove();
            }
            const newVerification = await Verification.create({
              payload: user.email,
              target: 'EMAIL',
            }).save();
            await sendVerificationEmail(user.fullName, newVerification.key);
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
        }
        return {
          ok: false,
          error: 'User has no email or already verified',
        };
      },
    ),
  },
};

export default resolvers;
