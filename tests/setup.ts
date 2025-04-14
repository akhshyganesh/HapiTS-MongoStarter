import logger from '@/utils/logger';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.test' });

process.env.NODE_ENV = 'test';
process.env.PORT = '4000';
process.env.JWT_SECRET = 'test-jwt-secret';

let mongoServer: MongoMemoryServer;

// Setup before all tests
beforeAll(async () => {
  jest.setTimeout(60000); // Increase timeout for this operation

  try {
    // Create MongoDB instance with correct options structure
    mongoServer = await MongoMemoryServer.create({
      instance: {
        storageEngine: 'wiredTiger',
      },
      binary: {
        version: '6.0.5',
        downloadDir: './.cache/mongodb-binaries',
      }
    });

    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);

    logger.info(`MongoDB Memory Server started at ${mongoUri}`);
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server', error);
    throw error;
  }
});

// Cleanup after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    logger.info('Closed mongoose connection');
  }

  if (mongoServer) {
    await mongoServer.stop();
    logger.info('Stopped MongoDB Memory Server');
  }
});

// This ensures the file has at least one test
describe('Test setup', () => {
  it('should setup test environment correctly', () => {
    expect(process.env.MONGODB_URI).toBeDefined();
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });
});
