import { Socket } from "socket.io-client";
import http from "http";
import https from "https";
import { URL } from "url";
import { logger } from "../utils/logger";
import { sendResult } from "../utils/utils";

export function runHttpMonitor(socket: Socket, monitor: any) {
  const startTime = Date.now();
  logger.debug(`Performing ${monitor.type} request: ${monitor.address}`);

  let url: URL;
  try {
    url = new URL(monitor.address);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    sendResult(socket, monitor.id, false, -1, {
      error: `Invalid URL: ${errorMessage}`,
      address: monitor.address,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const client = url.protocol === "https:" ? https : http;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  const req = client.get(url, { signal: controller.signal }, (res) => {
    clearTimeout(timeout);
    const responseTime = Date.now() - startTime;
    res.resume();
    sendResult(socket, monitor.id, true, responseTime, {
      address: monitor.address,
      statusCode: res.statusCode,
      headers: res.headers,
      timestamp: new Date().toISOString(),
    });
  });

  req.on("error", (err: unknown) => {
    clearTimeout(timeout);
    const errorMessage = err instanceof Error ? err.message : String(err);
    sendResult(socket, monitor.id, false, -1, {
      error: errorMessage,
      address: monitor.address,
      timestamp: new Date().toISOString(),
    });
  });
}
