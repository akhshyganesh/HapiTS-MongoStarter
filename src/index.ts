import 'dotenv/config';
import { startServer } from './server';
import { connectDatabase } from './config/database';
import logger from './utils/logger';

const start = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Hapi server
    const server = await startServer();
    logger.info(`Server running at: ${server.info.uri}`);
  } catch (error: IAny) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

start();

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection:', err);
  process.exit(1);
});
