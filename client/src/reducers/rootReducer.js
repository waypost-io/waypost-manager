import { combineReducers } from "redux";
import flags from './flags';
import experiments from './experiments';

const rootReducer = combineReducers({ flags, experiments });

export default rootReducer;