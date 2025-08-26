import { io } from "socket.io-client";
import { logger } from "./lib/utils/logger";
import { handleRunCommand } from "./lib/monitorHandlers";
import { checkConnectivity } from "./lib/utils/checkConnectivity";
import { appConfigDefault } from "./lib/utils/constant";

if (!appConfigDefault.AGENT_TOKEN) {
  logger.error("AGENT_TOKEN is not set");
  process.exit(1);
}

async function waitForConnectivity(url, retries = Infinity, delay = 5000) {
  let attempt = 0;
  while (true) {
    attempt++;
    try {
      await checkConnectivity(url);
      logger.info(`Connectivity OK after ${attempt} attempt(s).`);
      return true;
    } catch (err) {
      logger.warn(
        `Connectivity check failed (attempt ${attempt}): ${err.message}`
      );
      if (attempt >= retries && retries !== Infinity) {
        throw new Error("Connectivity failed after retries");
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function startAgent() {
  try {
    await waitForConnectivity(appConfigDefault.SERVER_URL);

    logger.info("Internet and server check passed. Connecting to socket...");

    const socket = io(appConfigDefault.SERVER_URL, {
      path: appConfigDefault.SOCKET_IO_PATH,
      auth: { token: appConfigDefault.AGENT_TOKEN },
      reconnectionDelay: 2000,
      reconnectionAttempts: Infinity,
    });

    socket.on("connect", () => {
      logger.info("✅ Connected to server");
    });

    socket.on("disconnect", (reason) => {
      logger.warn("⚠️ Disconnected: " + reason + ". Retrying...");
    });

    socket.on("health-check", () => {
      logger.info("Health check received, responding...");
      socket.emit("health-response", { status: "healthy" });
    });

    socket.on("connect_error", (err) => {
      logger.error("❌ Connection error: " + err.message);
    });

    socket.on("run-command", (monitor) => {
      handleRunCommand(socket, monitor);
    });
  } catch (err) {
    logger.error("Fatal startup error: " + err.message);
    process.exit(1);
  }
}

startAgent();
