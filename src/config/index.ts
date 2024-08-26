import * as dotenv from 'dotenv';
dotenv.config();

export default {
  mongoUri: process.env.MONGO_URI,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
};
