import mongoose from 'mongoose';
import { logger } from '../lib';

const mongoUri = "mongodb://localhost/mongo_tuts"
const mongooseLoader = () => {
  try {
    const connection = mongoose.createConnection(mongoUri)
  
    return connection;
  } catch (error: any) {
    logger.error('😱 Failed to load mongoose: ', error.message);
    logger.error(error);
  }
};

export default mongooseLoader;
