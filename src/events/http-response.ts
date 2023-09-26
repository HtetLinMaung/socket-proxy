import { log } from "starless-logger";
import server from "starless-server";
import { eventEmitter } from "../constants";

export default (io: any, socket: any) => (data: any) => {
  log(`http-response event triggered with data: ${JSON.stringify(data)}`);
  eventEmitter.emit(data.requestId, {
    state: data.state,
    response: data.response,
  });
  // server.sharedMemory.set(data.requestId, {
  //   state: data.state,
  //   response: data.response,
  // });
};
