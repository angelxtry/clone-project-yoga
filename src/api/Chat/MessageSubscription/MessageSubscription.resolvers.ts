import { withFilter } from 'graphql-yoga';
import Message from '../../../entities/Message';
import { pubSubContext, subscriptionCtx, Payload } from '../../../types/types';
import Chat from '../../../entities/Chat';

const resolvers = {
  Subscription: {
    MessageSubscription: {
      subscribe: withFilter(
        (_: any, __: any, { pubSub }: pubSubContext) =>
          pubSub.asyncIterator('sendMessage'),
        async (
          payload: Payload<Message>,
          _: any,
          { context }: subscriptionCtx,
        ) => {
          const user = context.currentUser;
          const {
            MessageSubscription: { chatId },
          } = payload;
          try {
            const chat = await Chat.findOne({ id: chatId });
            if (chat) {
              return user.id === chat.passengerId || user.id === chat.driverId;
            }
            return false;
          } catch (error) {
            return false;
          }
        },
      ),
    },
  },
};

export default resolvers;
