import { io } from "socket.io-client";
import ping from "ping";

const AGENT_ID = 1;
const USER_ID = 1;
const BACKEND_URL = "http://localhost:4001";

const socket = io(BACKEND_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

socket.on("connect", () => {
  console.log("✅ Connected to backend");

  socket.emit("register", {
    agentId: AGENT_ID,
    userId: USER_ID,
  });
});

socket.on("ping", async (msg: string) => {
  try {
    const { targetAddress } = JSON.parse(msg);

    const result = await ping.promise.probe(targetAddress);

    socket.emit("pingResult", {
      targetAddress,
      time: result.time,
      alive: result.alive,
    });

    console.log(`📡 Pinged ${targetAddress}: time=${result.time}ms`);
  } catch (err) {
    console.error("❌ Ping error:", err);
  }
});

socket.on("disconnect", () => {
  console.warn("⚠️ Disconnected from backend");
});
