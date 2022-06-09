import { Application } from "express";
import expressLoader from "./express";
import { logger } from "../lib";
import mongooseLoader from "./mongoose";

const loader = async (app: Application) => {
  try {
    // await mongooseLoader();
    // logger.info(`🛸️ MongoDB loaded successfully`);

    await expressLoader({ app });
    logger.info("💯 Express loaded successfully");
  } catch (error: any) {
    logger.error(error.message);
    logger.error(error);
  }
};

export default loader;
