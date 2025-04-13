import jwt, { SignOptions } from 'jsonwebtoken';
import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { IUser, User } from '@/models/user.model';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Extend Request type to include user property
declare module '@hapi/hapi' {
  interface Request {
    user?: IUser;
  }
}

export const validateToken = async (
  decoded: JwtPayload,
  request: Request,
  _h: ResponseToolkit, // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<{ isValid: boolean }> => {
  try {
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return { isValid: false };
    }

    request.user = user;

    return { isValid: true };
  } catch (error: IAny) {
    return { isValid: false };
  }
};

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const expiresIn = process.env.JWT_EXPIRATION || '1d';

  const options: SignOptions = { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] };
  return jwt.sign(payload, secret, options);
};

export const isAdmin = (request: Request, h: ResponseToolkit): symbol | void => {
  if (request.user && request.user.role === 'admin') {
    return h.continue;
  }

  throw Boom.forbidden('Access denied: Admin role required');
};
