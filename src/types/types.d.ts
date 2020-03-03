import User from '../entities/User';

export type verificationTarget = 'PHONE' | 'EMAIL';

export type rideStatus =
  | 'ACCEPT'
  | 'FINISHED'
  | 'CANCELED'
  | 'REQUESTED'
  | 'ONROUTE';

export type ReqContext = {
  req: {
    user: User
  }
}
