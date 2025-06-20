import { io } from "socket.io-client";
import { logger } from "./lib/utils/logger";
import { handleRunCommand } from "./lib/monitorHandlers";
import { checkConnectivity } from "./lib/utils/checkConnectivity";
import { appConfigDefault } from "./lib/utils/constant";

if (!appConfigDefault.AGENT_TOKEN) {
  logger.error("AGENT_TOKEN is not set");
  process.exit(1);
}

checkConnectivity(appConfigDefault.SERVER_URL)
  .then(() => {
    logger.info("Internet and server check passed. Connecting to socket...");

    const socket = io(appConfigDefault.SERVER_URL, {
      path: appConfigDefault.SOCKET_IO_PATH,
      auth: { token: appConfigDefault.AGENT_TOKEN },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      logger.info("Connected to server");
    });

    socket.on("disconnect", (reason) => {
      logger.error("Disconnected: " + reason);
    });

    socket.on("health-check", () => {
      logger.info("Health check received, responding...");
      socket.emit("health-response", { status: "healthy" });
    });

    socket.on("connect_error", (err) => {
      logger.error("Connection error: " + err.message);
      process.exit(1);
    });

    socket.on("run-command", (monitor) => {
      handleRunCommand(socket, monitor);
    });
  })
  .catch((err) => {
    logger.error(`Connectivity check failed: ${err.message}`);
    process.exit(1);
  });
