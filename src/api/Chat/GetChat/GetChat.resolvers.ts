import Chat from '../../../entities/Chat';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';
import { GetChatResponse, GetChatQueryArgs } from '../../../types/graphql';
import { reqContext } from '../../../types/types';

const resolvers: Resolvers = {
  Query: {
    GetChat: authResolver(
      async (
        _: any,
        args: GetChatQueryArgs,
        { req }: reqContext,
      ): Promise<GetChatResponse> => {
        const { user } = req;
        try {
          const chat = await Chat.findOne(
            {
              id: args.chatId,
            },
            { relations: ['messages'] },
          );
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
