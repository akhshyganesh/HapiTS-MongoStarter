import { Server } from '@hapi/hapi';
import hapiAuthJwt2 from 'hapi-auth-jwt2';
import { validateToken } from '@/middleware/auth/auth.middleware';
import { ipLogger } from '@/middleware/logging/ip-logger';
import * as Boom from '@hapi/boom';
import { Request, ResponseToolkit } from '@hapi/hapi';

export const registerPlugins = async (server: Server): Promise<void> => {
  // Register JWT authentication
  await server.register(hapiAuthJwt2);

  // Configure JWT strategy
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET || 'your-secret-key',
    validate: validateToken,
    verifyOptions: { algorithms: ['HS256'] },
  });

  // Set default auth strategy
  server.auth.default('jwt');

  // Register IP logger on all requests
  server.ext('onRequest', ipLogger);

  const boomErrorHandler = (request: Request, h: ResponseToolkit): IAny => {
    const error = request.response as Boom.Boom;
    if (!error.isBoom) {
      return h.continue;
    }

    const responseBody = {
      statusCode: error.output.statusCode,
      error: error.output.payload.error,
      message: error.message,
    };

    return h.response(responseBody).code(error.output.statusCode);
  };

  server.ext('onPreResponse', boomErrorHandler);
};
