import Chat from '../../../entities/Chat';
import User from '../../../entities/User';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';
import { GetChatResponse, GetChatQueryArgs } from '../../../types/graphql';

const resolvers: Resolvers = {
  Query: {
    GetChat: authResolver(
      async (
        _: any,
        args: GetChatQueryArgs,
        { req }: { req: any },
      ): Promise<GetChatResponse> => {
        const { user }: { user: User } = req;
        try {
          const chat = await Chat.findOne({
            id: args.chatId,
          }, { relations: ['driver', 'passenger'] });
          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              return {
                ok: true,
                error: null,
                chat,
              };
            }
            return {
              ok: false,
              error: 'Not authorized to join this chat',
              chat: null,
            };
          }
          return {
            ok: false,
            error: 'Chat not found',
            chat: null,
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            chat: null,
          };
        }
      },
    ),
  },
};

export default resolvers;
