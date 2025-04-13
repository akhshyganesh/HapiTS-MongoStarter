import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { registerPlugins } from '@/plugins';
import { registerRoutes } from '@/routes';

const validationErrorHandler = (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
  err?: Error,
): Hapi.Lifecycle.ReturnValue => {
  if (err) {
    throw Boom.badRequest(err.message);
  }
  return h.continue;
};

export const startServer = async (): Promise<Hapi.Server> => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        // origin: ['*'],
        origin: ['localhost:3001', 'http://localhost:3001'],
        credentials: true,
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        exposedHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        maxAge: 86400,
      },
      validate: {
        failAction: validationErrorHandler,
      },
    },
  });

  // Register plugins
  await registerPlugins(server);

  // Register routes
  registerRoutes(server);

  await server.start();
  return server;
};

export const init = async (): Promise<Hapi.Server> => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    routes: {
      validate: {
        failAction: async (request, h, err) => {
          if (process.env.NODE_ENV === 'production') {
            throw Boom.badRequest('Invalid request payload');
          } else {
            throw err;
          }
        }
      }
    }
  });

  await registerPlugins(server);
  registerRoutes(server);
  
  return server;
};

if (!module.parent) {
  // Only start the server if this file is run directly
  const start = async () => {
    try {
      const server = await init();
      await server.start();
      console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };
  start();
}
