import { PubSub } from 'graphql-yoga';
import User from '../entities/User';

export type verificationTarget = 'PHONE' | 'EMAIL';

export type rideStatus =
  | 'ACCEPT'
  | 'FINISHED'
  | 'CANCELED'
  | 'REQUESTED'
  | 'ONROUTE';

export type reqContext = {
  req: {
    user: User;
  };
};

export type pubSubContext = {
  pubSub: PubSub;
};

export type subscriptionCtx = {
  context: {
    currentUser: User;
  };
};
