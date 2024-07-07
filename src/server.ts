import * as Hapi from '@hapi/hapi';
import connectDB from '@/config/db';
import routes from '@/routes';
import config from '@/config';

const server: Hapi.Server = Hapi.server({
  port: config.port,
  host: 'localhost',
});

const start = async () => {
  await connectDB();

  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

start();
