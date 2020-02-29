import User from '../../../entities/User';
import {
  EmailSignUpMutationArgs,
  EmailSignUpResponse,
} from '../../../types/graphql';
import { Resolvers } from '../../../types/resolvers';

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
        await User.create({ ...args }).save();
        return {
          ok: true,
          error: null,
          token: 'token',
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
