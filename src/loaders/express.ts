import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import routes from "../routes";
import multer from "multer";
import logger from "morgan";
import  connectBusboy from "connect-busboy";

type Props = { app: Application };
const expressLoader = async ({ app }: Props) => {
  //#region Middlewares
  app.use(cors());
  app.use(express.json({ limit: "50mb", strict: false }));
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(compression());
  // for parsing multipart/form-data

  // multer to add image to request
  app.use(multer().any());
  //#endregion
  app.use(logger("dev"))
  app.use('/posts', connectBusboy({immediate: true}))

  app.use("/", routes);
  // app.use(ErrorHandler); TODO: our own error handler
  //#endregion
};

export default expressLoader;
