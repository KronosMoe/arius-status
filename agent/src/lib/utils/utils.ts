import { Socket } from "socket.io-client";
import { logger } from "./logger";

export function sendResult(
  socket: Socket,
  monitorId: string | null,
  success: boolean,
  responseTime: number,
  metadata: Record<string, any>
): void {
  const status = success ? "SUCCESS" : "FAILURE";
  logger.info(`[${status}] Monitor result for`, { responseTime, metadata });

  socket.emit("command-result", {
    monitorId,
    responseTime: success ? responseTime : -1,
    metadata,
  });
}
