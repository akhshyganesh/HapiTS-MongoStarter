import mongoose from 'mongoose';
import config from '@/config';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri as string, {});
    console.log('MongoDB connected successfully');
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
