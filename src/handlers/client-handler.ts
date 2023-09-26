import { io } from "socket.io-client";
import findDomain from "../utils/find-domain";
import axios from "axios";
import { log } from "starless-logger";

const { SERVER_HOST, CLIENT_ID } = process.env;

export default function clientHandler() {
  const socket = io(SERVER_HOST || "http://localhost:3000");

  socket.on("connect", () => {
    socket.emit("join", CLIENT_ID);
    socket.on("http-trigger", async (req: any) => {
      log("Incomming http-trigger request: " + JSON.stringify(req));
      const method = req.method.toLowerCase();
      const domain = findDomain(req.path);
      let state = "ready";
      let axiosRes = null;
      try {
        if (method == "get" || method == "delete") {
          axiosRes = await (axios as any)[method](`${domain}${req.url}`, {
            headers: req.headers as any,
          });
        } else {
          axiosRes = await (axios as any)[method](
            `${domain}${req.url}`,
            req.body,
            {
              headers: req.headers as any,
            }
          );
        }
      } catch (err) {
        state = "error";
        if (err.response) {
          axiosRes = err.response;
          if (err.response.status == 304) {
            state = "ready";
          }
        }
      }
      socket.emit("http-response", {
        state,
        response: {
          status: axiosRes.status,
          data: axiosRes.data,
          headers: axiosRes.headers,
        },
        requestId: req.requestId,
      });
    });
  });
}
