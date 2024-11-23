import Hapi from '@hapi/hapi';
import { ServerInjectOptions } from '@hapi/hapi';
import { describe, expect, beforeAll, afterAll, test } from '@jest/globals';
import connectDB, { disconnectDB } from '@/config/db';
import myRoutes from '@/routes/user.routes';

// Utility to initialize server
const initServer = async (): Promise<Hapi.Server> => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  server.route(myRoutes);

  await connectDB();
  await server.initialize();
  return server;
};

describe('Route Test', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await initServer();
  });

  afterAll(async () => {
    await server.stop();
    await disconnectDB();
  });

  test('GET /users - should return an array of users', async () => {
    const injectOptions: ServerInjectOptions = {
      method: 'GET',
      url: '/users',
      headers: {
        Authorization: 'Bearer token',
      },
    };

    const response = await server.inject(injectOptions);

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.result)).toBe(true);
  });
});
