import { io } from "socket.io-client";
import ping from "ping";
import http from "http";
import https from "https";
import net from "net";

const SERVER_URL = "http://localhost:4001";
const AGENT_TOKEN = "f5c86a80-b97e-4edd-b52d-1bb719c89029";

const socket = io(SERVER_URL, {
  auth: {
    token: AGENT_TOKEN,
  },
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("✅ Connected to server with id:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected:", reason);
});

socket.on("health-check", () => {
  console.log("🩺 Health check received, responding...");
  socket.emit("health-response", { status: "healthy" });
});

socket.on("connect_error", (err) => {
  console.error("🚫 Connection error:", err.message);
});

socket.on("run-command", (monitor) => {
  console.log(`🏃 Received run-command for monitor:`, monitor);

  if (!monitor.type || !monitor.address || !monitor.id) {
    console.error(`❗ Invalid monitor data:`, monitor);
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
    socket.emit("command-result", {
      monitorId: monitor.id,
      responseTime: success ? responseTime : -1,
      metadata,
    });
  };

  const startTime = Date.now();

  switch (monitor.type) {
    case "PING":
      ping.sys.probe(monitor.address, (isAlive) => {
        const responseTime = Date.now() - startTime;
        sendResult(!!isAlive, responseTime, {
          address: monitor.address,
          isAlive: !!isAlive,
          timestamp: new Date().toISOString(),
        });
      });
      break;

    case "HTTP":
    case "HTTPS":
      const client = monitor.type === "HTTPS" ? https : http;
      try {
        const req = client.get(monitor.address, (res) => {
          const responseTime = Date.now() - startTime;
          res.resume(); // Discard response body
          sendResult(true, responseTime, {
            address: monitor.address,
            statusCode: res.statusCode,
            headers: res.headers,
            timestamp: new Date().toISOString(),
          });
        });

        req.on("error", (err) => {
          sendResult(false, -1, {
            error: err.message,
            address: monitor.address,
            timestamp: new Date().toISOString(),
          });
        });

        req.setTimeout(5000, () => {
          req.abort();
          sendResult(false, -1, {
            error: "Request timeout",
            address: monitor.address,
            timestamp: new Date().toISOString(),
          });
        });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        sendResult(false, -1, {
          error: errorMessage,
          address: monitor.address,
          timestamp: new Date().toISOString(),
        });
      }
      break;

    case "TCP":
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
      sendResult(false, -1, {
        error: `Unknown monitor type: ${monitor.type}`,
        address: monitor.address,
        timestamp: new Date().toISOString(),
      });
  }
});
