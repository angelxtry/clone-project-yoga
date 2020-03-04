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

export interface ReqPubSubCtx extends reqContext, pubSubContext {}

export type subscriptionCtx = {
  context: {
    currentUser: User;
  };
};

export interface Payload<T> {
  [key: string]: T;
}
