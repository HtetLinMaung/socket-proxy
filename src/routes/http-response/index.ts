import { brewBlankExpressFunc } from "code-alchemy";
import { eventEmitter } from "../../constants";
import { log } from "starless-logger";

export default brewBlankExpressFunc(async (req, res) => {
  const { requestId, state, response } = req.body;
  log(`http-response api triggered with data: ${JSON.stringify(req.body)}`);
  eventEmitter.emit(requestId, {
    state: state,
    response: response,
  });
  res.json({
    code: 200,
    message: "Emitted successfully",
  });
});
