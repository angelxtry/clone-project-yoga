const authResolver = (resolverFunction: any) => async (
  parent: any,
  args: any,
  context: any,
  info: any,
) => {
  if (!context.req.user) {
    throw new Error('No JWT token');
  }
  const resolved = await resolverFunction(parent, args, context, info);
  return resolved;
};

export default authResolver;
