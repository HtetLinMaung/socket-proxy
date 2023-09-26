import server from "starless-server";

const { WAIT_TIMEOUT, WAIT_INTERVAL } = process.env;

export default function waitAndGetResponse(requestid: string) {
  return new Promise((resolve) => {
    let timeoutId: any = null;
    const intervalId = setInterval(() => {
      const data = server.sharedMemory.get(requestid);
      if (data && data.state == "ready") {
        clearInterval(intervalId);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        resolve(data);
      }
    }, parseInt(WAIT_INTERVAL || `${1 * 1000}`));
    timeoutId = setTimeout(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      resolve({ state: "timeout", response: null });
    }, parseInt(WAIT_TIMEOUT || `${30 * 1000}`));
  });
}
