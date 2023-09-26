import clientHandler from "./handlers/client-handler";
import fs from "fs";
import { domainMapPath } from "./constants";

const { MODE, CLIENT_ID } = process.env;

export const afterWorkerStart = async () => {
  if (MODE == "server" || MODE == "universal") {
    if (!fs.existsSync(domainMapPath)) {
      fs.writeFileSync(domainMapPath, JSON.stringify({}));
    }
  }
  if (MODE == "client" || MODE == "universal") {
    if (!CLIENT_ID) {
      throw new Error("Client ID is required");
    }
    clientHandler();
  }
};
