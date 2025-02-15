import * as Hapi from '@hapi/hapi';
import config from '@/config';
import connectDB from '@/config/db';
import routes from '@/routes';
import validateAuthToken from '@/middleware/validateAuthToken';
import { responseFormatter } from '@/plugins/responseFormatter.plugin';
import logIpAddress from '@/middleware/logIpAddress';

const server: Hapi.Server = Hapi.server({
  port: config.port,
  host: config.host,
  routes: {
    cors: true,
  },
});

const start = async () => {
  await connectDB();

  // Register plugins first
  await server.register(responseFormatter);

  // Add routes before middleware
  server.route(routes);

  server.ext('onRequest', logIpAddress);
  server.ext('onPreAuth', validateAuthToken);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

start();
