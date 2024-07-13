import Hapi from '@hapi/hapi';
import mongoose from 'mongoose';
import { ServerInjectOptions } from '@hapi/hapi';
import {
  jest,
  describe,
  expect,
  beforeAll,
  afterAll,
  test,
} from '@jest/globals';
import myRoutes from '../routes/user.routes';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
    once: jest.fn(),
  },
}));

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  server.route(myRoutes);

  await server.initialize();
  return server;
};

describe('Route Test', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await init();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('GET /example', async () => {
    const injectOptions: ServerInjectOptions = {
      method: 'GET',
      url: '/users',
    };
    const response = await server.inject(injectOptions);
    expect(response.statusCode).toBe(200);
    expect(response.result).toEqual({ message: 'success' });
  });
});
