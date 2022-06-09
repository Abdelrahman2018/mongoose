import express from "express";
import http from "http";
import { logger } from "./lib";
import loader from "./loaders";
import multer from "multer";

const port = 5000
async function startServer() {
  const app = express();
  const server = http.createServer(app);

  loader(app);

  server
    .listen(port, () =>
      logger.info(`🛡️  Server listening on port: ${port} 🛡️`)
    )
    .on("error", (error: any) => {
      if (error.syscall !== "listen") throw error;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case "EACCES":
          logger.error(`❌ PORT ${port} requires elevated privileges`);
          process.exit(1);
          break;
        case "EADDRINUSE":
          logger.error(`❌ PORT ${port} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

  /**
   * Event listener for process "error" events.
   */
  process.on("unhandledRejection", (error: any) => {
    logger.error(error);
    server.close(() => process.exit());
  });

  process.on("SIGTERM", () => {
    logger.info("SIGTERM RECEIVED, shutting down the app");
    // Serve all the requests before shutting down
    server.close(() => {
      logger.info("App terminated");
    });
  });
}

startServer();
