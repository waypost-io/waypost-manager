import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import flags from "../reducers/flags";

const store = createStore(flags, applyMiddleware(thunk));

export default store;
