import { sendVerificationSMS } from '@src/utils/sendSMS';
import Verification from '@src/entities/Verification';
import { Resolvers } from '@src/types/resolvers';
import {
  StartPhoneVerificationResponse,
  StartPhoneVerificationMutationArgs,
} from '@src/types/graphql';

const resolvers: Resolvers = {
  Mutation: {
    StartPhoneVerification: async (
      _,
      args: StartPhoneVerificationMutationArgs,
    ): Promise<StartPhoneVerificationResponse> => {
      const { phoneNumber } = args;
      try {
        const existingVerification = await Verification.findOne({
          payload: phoneNumber,
        });
        if (existingVerification) {
          await existingVerification.remove();
        }
        const newVerification = await Verification.create({
          payload: phoneNumber,
          target: 'PHONE',
        }).save();
        await sendVerificationSMS(newVerification.payload, newVerification.key);
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
  },
};

export default resolvers;
