import { combineReducers } from "redux";
import flags from './flags';
import experiments from './experiments';
import dbName from './dbName';

const rootReducer = combineReducers({ flags, experiments, dbName });

export default rootReducer;