import http from "http";
import https from "https";
import { URL } from "url";

export function checkConnectivity(serverUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let url: URL;
    try {
      url = new URL(serverUrl);
    } catch (err) {
      return reject(new Error("Invalid SERVER_URL"));
    }

    const client = url.protocol === "https:" ? https : http;
    const req = client.get(url, (res) => {
      res.resume();
      if (res.statusCode && res.statusCode < 500) {
        resolve();
      } else {
        reject(
          new Error(`Server responded with status code: ${res.statusCode}`)
        );
      }
    });

    req.on("error", (err) => reject(err));
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("Timeout while connecting to server"));
    });
  });
}
