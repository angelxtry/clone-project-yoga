import sendVerificationEmail from '@src/utils/sendEmail';
import Verification from '@src/entities/Verification';
import createJWT from '@src/utils/createJWT';
import User from '@src/entities/User';
import {
  EmailSignUpMutationArgs,
  EmailSignUpResponse,
} from '@src/types/graphql';
import { Resolvers } from '@src/types/resolvers';

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs,
    ): Promise<EmailSignUpResponse> => {
      const { email } = args;
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return {
            ok: false,
            error: 'Already SignUp. Please Login',
            token: null,
          };
        }
        const phoneVerification = await Verification.findOne({
          payload: args.phoneNumber,
          verified: true,
        });
        if (phoneVerification) {
          const newUser = await User.create({ ...args }).save();
          if (newUser.email) {
            const emailVerification = await Verification.create({
              payload: newUser.email,
              target: 'EMAIL',
            }).save();
            await sendVerificationEmail(
              newUser.fullName,
              emailVerification.key,
            );
          }
          const token = createJWT(newUser.id);
          return {
            ok: true,
            error: null,
            token,
          };
        }
        return {
          ok: false,
          error: 'You have not verified your phone number',
          token: null,
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }
    },
  },
};

export default resolvers;
