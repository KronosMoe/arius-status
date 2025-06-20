import { Socket } from "socket.io-client";
import net from "net";
import { logger } from "../utils/logger";
import { sendResult } from "../utils/utils";

export function runTcpMonitor(socket: Socket, monitor: any) {
  const startTime = Date.now();
  logger.debug("Attempting TCP connection to: " + monitor.address);

  const [host, portStr] = monitor.address.split(":");
  const port = parseInt(portStr, 10);

  if (!host || isNaN(port)) {
    sendResult(socket, monitor.id, false, -1, {
      error: "Invalid TCP address format. Use host:port",
      address: monitor.address,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const tcpClient = new net.Socket();
  tcpClient.setTimeout(5000);

  tcpClient.connect(port, host, () => {
    const responseTime = Date.now() - startTime;
    sendResult(socket, monitor.id, true, responseTime, {
      address: monitor.address,
      connected: true,
      timestamp: new Date().toISOString(),
    });
    tcpClient.destroy();
  });

  tcpClient.on("error", (err) => {
    sendResult(socket, monitor.id, false, -1, {
      error: err.message,
      address: monitor.address,
      timestamp: new Date().toISOString(),
    });
    tcpClient.destroy();
  });

  tcpClient.on("timeout", () => {
    sendResult(socket, monitor.id, false, -1, {
      error: "TCP connection timeout",
      address: monitor.address,
      timestamp: new Date().toISOString(),
    });
    tcpClient.destroy();
  });
}
