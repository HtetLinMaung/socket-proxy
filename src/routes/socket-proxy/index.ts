import { brewBlankExpressFunc } from "code-alchemy";
import server from "starless-server";
import { v4 } from "uuid";
import { log } from "starless-logger";
import { eventEmitter } from "../../constants";

const { CLIENT_ID, WAIT_TIMEOUT } = process.env;

export default brewBlankExpressFunc(async (req, res) => {
  log(
    "socket-proxy request body: " +
      JSON.stringify({
        url: req.url,
        body: req.body,
        path: req.path,
        params: req.params,
        headers: req.headers,
        query: req.query,
      })
  );
  const requestId = v4();
  let timeoutId: any = null;
  eventEmitter.once(requestId, (data: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (data.state == "timeout") {
      res.status(408).json({ code: 408, message: "Request Timeout" });
    } else if (data.state == "error") {
      res.status(500).json({ code: 500, message: "Something went wrong!" });
    } else {
      // Set headers from Axios response to Express response
      for (let key in data.response.headers) {
        res.setHeader(key, data.response.headers[key]);
      }

      res.status(data.response.status || 200).send(data.response.data);
    }
  });
  const serverio = server.getIO();
  serverio.to(req.query.clientid || CLIENT_ID).emit("http-trigger", {
    url: req.url,
    path: req.path,
    headers: req.headers,
    method: req.method,
    body: req.body,
    params: req.params,
    requestId,
  });
  timeoutId = setTimeout(() => {
    eventEmitter.emit(requestId, { state: "timeout", response: null });
  }, parseInt(WAIT_TIMEOUT || `${30 * 1000}`));
});
