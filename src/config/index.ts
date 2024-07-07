import * as dotenv from 'dotenv';
dotenv.config();

export default {
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 3000,
};
