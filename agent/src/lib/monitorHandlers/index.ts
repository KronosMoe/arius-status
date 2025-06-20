import { Socket } from "socket.io-client";
import { runPingMonitor } from "./ping";
import { runHttpMonitor } from "./http";
import { runTcpMonitor } from "./tcp";
import { logger } from "../utils/logger";
import { sendResult } from "../utils/utils";

export function handleRunCommand(socket: Socket, monitor: any) {
  logger.info(`Received run-command for monitor:`, monitor);

  if (!monitor.type || !monitor.address || !monitor.id) {
    logger.error(`Invalid monitor data: ${JSON.stringify(monitor)}`);
    sendResult(socket, monitor.id ?? null, false, -1, {
      error: "Invalid monitor data",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  switch (monitor.type) {
    case "PING":
      runPingMonitor(socket, monitor);
      break;
    case "HTTP":
    case "HTTPS":
      runHttpMonitor(socket, monitor);
      break;
    case "TCP":
      runTcpMonitor(socket, monitor);
      break;
    default:
      logger.error("Unknown monitor type received: " + monitor.type);
      sendResult(socket, monitor.id, false, -1, {
        error: `Unknown monitor type: ${monitor.type}`,
        address: monitor.address,
        timestamp: new Date().toISOString(),
      });
  }
}
