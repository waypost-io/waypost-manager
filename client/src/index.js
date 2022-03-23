import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './lib/Store'
import { Provider } from 'react-redux'

// if (process.env.NODE_ENV === 'development') {
//   const { worker } = require('./mocks/browser')
//   worker.start()
// }

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);