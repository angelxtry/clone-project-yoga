import { ReqPubSubCtx } from '../../../types/types';
import Message from '../../../entities/Message';
import Chat from '../../../entities/Chat';
import authResolver from '../../../utils/authResolver';
import {
  SendChatMessageMutationArgs,
  SendChatMessageResponse,
} from '../../../types/graphql';
import { Resolvers } from '../../../types/resolvers';

const resolvers: Resolvers = {
  Mutation: {
    SendChatMessage: authResolver(
      async (
        _: any,
        args: SendChatMessageMutationArgs,
        { req, pubSub }: ReqPubSubCtx,
      ): Promise<SendChatMessageResponse> => {
        const { user } = req;
        try {
          const chat = await Chat.findOne({ id: args.chatId });
          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              const message = await Message.create({
                text: args.text,
                chat,
                user,
              }).save();
              pubSub.publish('sendMessage', { MessageSubscription: message });
              return {
                ok: true,
                error: null,
                message,
              };
            }
            return {
              ok: false,
              error: 'Not authorized to send message',
              message: null,
            };
          }
          return {
            ok: false,
            error: 'Chat not found',
            message: null,
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            message: null,
          };
        }
      },
    ),
  },
};

export default resolvers;
