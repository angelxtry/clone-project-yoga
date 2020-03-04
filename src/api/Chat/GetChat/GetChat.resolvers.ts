import Chat from '@src/entities/Chat';
import { Resolvers } from '@src/types/resolvers';
import authResolver from '@src/utils/authResolver';
import { GetChatResponse, GetChatQueryArgs } from '@src/types/graphql';
import { reqContext } from '@src/types/types';

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
