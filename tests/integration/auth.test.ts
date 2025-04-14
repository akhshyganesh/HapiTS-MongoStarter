import Hapi from '@hapi/hapi';
import { Server } from '@hapi/hapi';
import mongoose from 'mongoose';
import { init } from '../../src/server';
import { User } from '../../src/models/user.model';

describe('Authentication', () => {
  let server: Server;

  beforeAll(async () => {
    server = await init();
    // Don't connect to MongoDB here since it's handled in setup.ts
  }, 30000); // Extend timeout for server initialization

  afterAll(async () => {
    try {
      // Clean up users created during tests
      await User.deleteMany({});
      await server.stop();
    } catch (error) {
      console.error('Error during test cleanup:', error);
    }
  }, 30000); // Extend timeout for cleanup

  describe('POST /api/users', () => {
    it('should register a new user', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/users',
        payload: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123!',
        },
      });

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.payload)).toHaveProperty('token');
    });
  });

  describe('POST /auth/login', () => {
    it('should login an existing user', async () => {
      // First register
      await server.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          username: 'loginuser',
          email: 'login@example.com',
          password: 'Password123!',
        },
      });

      // Then login
      const response = await server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'login@example.com',
          password: 'Password123!',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toHaveProperty('token');
    });
  });
});
