import { combineReducers } from "redux";
import flags from "./flags";
import experiments from "./experiments";
import metrics from "./metrics";
import dbName from "./dbName";
import sdkKey from "./sdkKey";
import flagLog from "./flagLog";

const rootReducer = combineReducers({
  flags,
  experiments,
  metrics,
  dbName,
  sdkKey,
  flagLog,
});

export default rootReducer;
