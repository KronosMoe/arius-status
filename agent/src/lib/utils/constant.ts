import * as dotenv from "dotenv";

dotenv.config();

export const appConfigDefault = {
  SERVER_URL: "https://status.arius.cloud",
  SOCKET_IO_PATH: "/api/agents",
  AGENT_TOKEN: process.env.TOKEN,
};
