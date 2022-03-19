import { combineReducers } from "redux";
import flags from './flags';
import experiments from './experiments';
import metrics from './metrics';
import dbName from './dbName';
import sdkKey from './sdkKey';

const rootReducer = combineReducers({ flags, experiments, metrics, dbName, sdkKey });

export default rootReducer;
