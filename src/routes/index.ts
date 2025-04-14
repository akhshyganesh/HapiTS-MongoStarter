import { Server } from '@hapi/hapi';
import { authRoutes } from '@/routes/auth.routes';
import { userRoutes } from '@/routes/user.routes';
import { healthRoutes } from '@/routes/health.routes';

export const registerRoutes = (server: Server): void => {
  server.route([...healthRoutes, ...authRoutes, ...userRoutes]);
};
