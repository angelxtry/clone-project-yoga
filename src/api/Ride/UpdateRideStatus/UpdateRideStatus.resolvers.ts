import Chat from '../../../entities/Chat';
import Ride from '../../../entities/Ride';
import User from '../../../entities/User';
import authResolver from '../../../utils/authResolver';
import { Resolvers } from '../../../types/resolvers';
import {
  UpdateRideStatusResponse,
  UpdateRideStatusMutationArgs,
} from '../../../types/graphql';

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: authResolver(
      async (
        _: any,
        args: UpdateRideStatusMutationArgs,
        { req, pubSub }: { req: any; pubSub: any },
      ): Promise<UpdateRideStatusResponse> => {
        const { user }: { user: User } = req;
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
            if (args.status === 'ACCEPTED') {
              ride = await Ride.findOne(
                {
                  id: args.rideId,
                  status: 'REQUESTED',
                },
                { relations: ['passenger'] },
              );
              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();
                const chat = await Chat.create({
                  driver: user,
                  passenger: ride.passenger,
                }).save();
                ride.chat = chat;
                ride.save();
              }
            } else {
              ride = await Ride.findOne({
                id: args.rideId,
                driver: user,
              });
            }
            if (ride) {
              ride.status = args.status;
              ride.save();
              pubSub.publish('rideUpdate', { RideStatusSubscription: ride });
              return {
                ok: true,
                error: null,
              };
            }
            return {
              ok: false,
              error: 'Not found ride',
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
          error: 'You are not driver',
        };
      },
    ),
  },
};

export default resolvers;
