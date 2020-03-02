const cleanNullArgs = (args: object): object => {
  const notNull: { [key: string]: string | number } = {};
  Object.keys(args).forEach((property) => {
    if ((args as any)[property] !== null) {
      notNull[property] = (args as any)[property];
    }
  });
  return notNull;
};

export default cleanNullArgs;
