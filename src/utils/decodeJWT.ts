import * as jwt from 'jsonwebtoken';
import User from '../entities/User';

const decodeJWT = async (token: string): Promise<User | undefined> => {
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_TOKEN as string);
    const { id } = decoded;
    const user = await User.findOne({ id });
    return user;
  } catch (error) {
    console.log({ error });
    return undefined;
  }
};

export default decodeJWT;
