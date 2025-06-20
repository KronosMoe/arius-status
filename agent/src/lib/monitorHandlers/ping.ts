import { Socket } from "socket.io-client";
import ping from "ping";
import { logger } from "../utils/logger";
import { sendResult } from "../utils/utils";

export function runPingMonitor(socket: Socket, monitor: any) {
  const startTime = Date.now();
  logger.debug("Pinging: " + monitor.address);

  ping.sys.probe(monitor.address, (isAlive) => {
    const responseTime = Date.now() - startTime;
    sendResult(socket, monitor.id, !!isAlive, responseTime, {
      address: monitor.address,
      isAlive: !!isAlive,
      timestamp: new Date().toISOString(),
    });
  });
}
