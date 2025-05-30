import { io } from "socket.io-client";
import ping from "ping";
import http from "http";
import https from "https";
import { URL } from "url";
import net from "net";
import { logger } from "./lib/logger";

const SERVER_URL = "http://localhost:4001";
const AGENT_TOKEN = "5022773e-cb88-4d6c-9456-4a367385f37e";

const socket = io(SERVER_URL, {
  auth: {
    token: AGENT_TOKEN,
  },
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  logger.info("🚀 Connected to server");
});

socket.on("disconnect", (reason) => {
  logger.error("❌ Disconnected: " + reason);
});

socket.on("health-check", () => {
  logger.info("🩺 Health check received, responding...");
  socket.emit("health-response", { status: "healthy" });
});

socket.on("connect_error", (err) => {
  logger.error("🚫 Connection error: " + err.message);
});

socket.on("run-command", (monitor) => {
  logger.log(`🏃 Received run-command for monitor:`, monitor);

  if (!monitor.type || !monitor.address || !monitor.id) {
    logger.error(`❗ Invalid monitor data: ${monitor}`);
    socket.emit("command-result", {
      monitorId: monitor.id ?? null,
      responseTime: -1,
      metadata: {
        error: "Invalid monitor data",
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  const sendResult = (
    success: boolean,
    responseTime: number,
    metadata: Record<string, any>
  ): void => {
    const status = success ? "SUCCESS" : "FAILURE";
    logger.info(
      `[${status}] Monitor result for ${monitor.type} (${monitor.address})`,
      {
        responseTime,
        metadata,
      }
    );

    socket.emit("command-result", {
      monitorId: monitor.id,
      responseTime: success ? responseTime : -1,
      metadata,
    });
  };

  const startTime = Date.now();

  switch (monitor.type) {
    case "PING": {
      logger.debug("Pinging: " + monitor.address);
      ping.sys.probe(monitor.address, (isAlive) => {
        const responseTime = Date.now() - startTime;
        sendResult(!!isAlive, responseTime, {
          address: monitor.address,
          isAlive: !!isAlive,
          timestamp: new Date().toISOString(),
        });
      });
      break;
    }

    case "HTTP":
    case "HTTPS": {
      logger.debug(`Performing ${monitor.type} request: ${monitor.address}`);
      let url: URL;
      try {
        url = new URL(monitor.address);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        sendResult(false, -1, {
          error: `Invalid URL: ${errorMessage}`,
          address: monitor.address,
          timestamp: new Date().toISOString(),
        });
        break;
      }

      const client = url.protocol === "https:" ? https : http;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const req = client.get(url, { signal: controller.signal }, (res) => {
        clearTimeout(timeout);
        const responseTime = Date.now() - startTime;
        res.resume(); // discard body
        sendResult(true, responseTime, {
          address: monitor.address,
          statusCode: res.statusCode,
          headers: res.headers,
          timestamp: new Date().toISOString(),
        });
      });

      req.on("error", (err: unknown) => {
        clearTimeout(timeout);
        const errorMessage = err instanceof Error ? err.message : String(err);
        sendResult(false, -1, {
          error: errorMessage,
          address: monitor.address,
          timestamp: new Date().toISOString(),
        });
      });

      break;
    }

    case "TCP":
      logger.debug("Attempting TCP connection to: " + monitor.address);
      const [host, portStr] = monitor.address.split(":");
      const port = parseInt(portStr, 10);

      if (!host || isNaN(port)) {
        sendResult(false, -1, {
          error: "Invalid TCP address format. Use host:port",
          address: monitor.address,
          timestamp: new Date().toISOString(),
        });
        break;
      }

      const tcpClient = new net.Socket();
      tcpClient.setTimeout(5000);

      tcpClient.connect(port, host, () => {
        const responseTime = Date.now() - startTime;
        sendResult(true, responseTime, {
          address: monitor.address,
          connected: true,
          timestamp: new Date().toISOString(),
        });
        tcpClient.destroy();
      });

      tcpClient.on("error", (err) => {
        sendResult(false, -1, {
          error: err.message,
          address: monitor.address,
          timestamp: new Date().toISOString(),
        });
        tcpClient.destroy();
      });

      tcpClient.on("timeout", () => {
        sendResult(false, -1, {
          error: "TCP connection timeout",
          address: monitor.address,
          timestamp: new Date().toISOString(),
        });
        tcpClient.destroy();
      });
      break;

    default:
      logger.error("Unknown monitor type received: " + monitor.type);
      sendResult(false, -1, {
        error: `Unknown monitor type: ${monitor.type}`,
        address: monitor.address,
        timestamp: new Date().toISOString(),
      });
  }
});
