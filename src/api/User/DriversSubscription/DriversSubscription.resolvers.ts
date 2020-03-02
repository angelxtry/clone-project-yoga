const resolvers = {
  Subscription: {
    DriversSubscription: {
      subscribe: (_: any, __: any, { pubSub }: { pubSub: any}) =>
        pubSub.asyncIterator('driverUpdate'),
    },
  },
};

export default resolvers;
