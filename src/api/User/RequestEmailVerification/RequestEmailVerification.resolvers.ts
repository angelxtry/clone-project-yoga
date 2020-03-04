import { reqContext } from '@src/types/types';
import sendVerificationEmail from '@src/utils/sendEmail';
import Verification from '@src/entities/Verification';
import { Resolvers } from '@src/types/resolvers';
import { RequestEmailVerificationResponse } from '@src/types/graphql';
import authResolver from '@src/utils/authResolver';

const resolvers: Resolvers = {
  Mutation: {
    RequestEmailVerification: authResolver(
      async (
        _: any,
        __: any,
        { req }: reqContext,
      ): Promise<RequestEmailVerificationResponse> => {
        const { user } = req;
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
