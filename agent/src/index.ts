import { io, Socket } from "socket.io-client";
import { logger } from "./lib/utils/logger";
import { handleRunCommand } from "./lib/monitorHandlers";
import { checkConnectivity } from "./lib/utils/checkConnectivity";
import { appConfigDefault } from "./lib/utils/constant";

if (!appConfigDefault.AGENT_TOKEN) {
  logger.error("AGENT_TOKEN is not set");
  process.exit(1);
}

async function waitForConnectivity(
  url: string,
  retries: number = Infinity,
  delay: number = 5000
): Promise<boolean> {
  let attempt = 0;
  while (true) {
    attempt++;
    try {
      await checkConnectivity(url);
      logger.info(`Connectivity OK after ${attempt} attempt(s).`);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.warn(
        `Connectivity check failed (attempt ${attempt}): ${message}`
      );
      if (attempt >= retries && retries !== Infinity) {
        throw new Error("Connectivity failed after retries");
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function startAgent(): Promise<void> {
  try {
    await waitForConnectivity(appConfigDefault.SERVER_URL);

    logger.info("Internet and server check passed. Connecting to socket...");

    const socket: Socket = io(appConfigDefault.SERVER_URL, {
      path: appConfigDefault.SOCKET_IO_PATH,
      auth: { token: appConfigDefault.AGENT_TOKEN },
      reconnectionDelay: 2000,
      reconnectionAttempts: Infinity,
    });

    socket.on("connect", () => {
      logger.info("✅ Connected to server");
    });

    socket.on("disconnect", (reason: string) => {
      logger.warn("⚠️ Disconnected: " + reason + ". Retrying...");
    });

    socket.on("health-check", () => {
      logger.info("Health check received, responding...");
      socket.emit("health-response", { status: "healthy" });
    });

    socket.on("connect_error", (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      logger.error("❌ Connection error: " + message);
    });

    socket.on("run-command", (monitor: unknown) => {
      handleRunCommand(socket, monitor);
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error("Fatal startup error: " + message);
    process.exit(1);
  }
}

startAgent();
