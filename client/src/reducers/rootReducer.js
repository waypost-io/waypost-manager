import { combineReducers } from "redux";
import flags from './flags';
import experiments from './experiments';
import metrics from './metrics';
import dbName from './dbName';

const rootReducer = combineReducers({ flags, experiments, metrics, dbName });

export default rootReducer;