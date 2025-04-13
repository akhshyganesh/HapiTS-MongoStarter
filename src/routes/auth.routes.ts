import { ServerRoute } from '@hapi/hapi';
import { AuthController } from '@/controllers/auth.controller';

const authController = new AuthController();

export const authRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/auth/login',
    options: {
      auth: false,
      description: 'User login',
      tags: ['api', 'auth'],
      handler: authController.login,
    },
  },
];
