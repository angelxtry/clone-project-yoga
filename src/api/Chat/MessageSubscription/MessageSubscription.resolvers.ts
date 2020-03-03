import { withFilter } from 'graphql-yoga';
import Chat from '../../../entities/Chat';
import User from '../../../entities/User';

const resolvers = {
  Subscription: {
    MessageSubscription: {
      subscribe: withFilter(
        (_: any, __: any, { pubSub }) => pubSub.asyncIterator('sendMessage'),
        async (payload: any, _: any, { context }) => {
          const user: User = context.currentUser;
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
