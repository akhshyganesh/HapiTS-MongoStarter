import Boom from '@hapi/boom';
import { User } from '../models/user.model';
import { generateToken } from '../middleware/auth/auth.middleware';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export class AuthService {
  public async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await user.comparePassword(password);

      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      if (!user.isActive) {
        throw Boom.forbidden('Account is disabled');
      }

      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error: IAny) {
      throw error;
    }
  }
}
