import { log } from "starless-logger";

export default (io: any, socket: any) => (clientid: string) => {
  socket.join(clientid);
  log(`Client ${clientid} joined.`);
};
