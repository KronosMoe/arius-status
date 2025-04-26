import { io } from "socket.io-client";
import ping from "ping";

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

// 🆕 Updated 'run-command' event to send { monitorId, responseTime, metadata }
socket.on("run-command", (monitor) => {
  console.log(`🏃 Received run-command for monitor:`, monitor);

  if (!monitor.type || !monitor.address) {
    console.error(`❗ Invalid monitor data:`, monitor);
    return;
  }

  if (monitor.type === "PING") {
    const startTime = Date.now();

    ping.sys.probe(monitor.address, (isAlive) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const metadata = {
        address: monitor.address,
        isAlive,
        timestamp: new Date().toISOString(),
      };

      socket.emit("command-result", {
        monitorId: monitor.id,
        responseTime: isAlive ? responseTime : -1,
        metadata,
      });
    });
  } else {
    console.warn(`⚠️ Unknown monitor type: ${monitor.type}`);
    socket.emit("command-result", {
      monitorId: monitor.id,
      responseTime: -1,
      metadata: {
        error: `Unknown monitor type: ${monitor.type}`,
        timestamp: new Date().toISOString(),
      },
    });
  }
});
