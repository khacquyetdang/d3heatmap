import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import Root from './components/Root';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './configureStore';

const store = configureStore();

ReactDOM.render(
  <Root store={store}>
  </Root>, document.getElementById('root')
);

registerServiceWorker();
