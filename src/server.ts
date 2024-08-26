import * as Hapi from '@hapi/hapi';
// config
import config from '@/config';
import connectDB from '@/config/db';
//routes
import routes from '@/routes';
// middleware
import validateAuthToken from '@/middleware/validateAuthToken';
import logIpAddress from '@/middleware/logIpAddress';
//plugin
import responseFormatter from '@/plugin/responseFormatter.plugin';

const server: Hapi.Server = Hapi.server({
  port: config.port,
  host: config.host,
  routes: {
    cors: {
      origin: ['http://localhost:3000'], // Allows requests only from http://localhost:3000
    },
  },
});

const start = async () => {
  await connectDB();

  server.ext('onRequest', logIpAddress);
  server.ext('onRequest', validateAuthToken);
  server.route(routes);

  await server.register(responseFormatter);
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

start();
