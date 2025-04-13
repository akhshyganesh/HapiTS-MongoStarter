import mongoose from 'mongoose';
import logger from '@/utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hapi-starter';
    logger.info(`Connecting to MongoDB at ${mongoUri.split('?')[0]}`);

    await mongoose.connect(mongoUri);

    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    throw error;
  }
};

export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('Closed MongoDB connection');
  } catch (error) {
    logger.error('Error closing MongoDB connection', error);
  }
};
