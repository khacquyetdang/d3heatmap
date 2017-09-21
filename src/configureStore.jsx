import { createStore, applyMiddleware } from 'redux';
// import { loadState } from './loadercsv.js';
import { createLogger } from 'redux-logger';
import reducer from './reducers/index';
import throttle from 'lodash/throttle';
import thunk from 'redux-thunk';

const configureStore = () => {
  //const persistedState = loadState();
  //var store = createStore(reducer, persistedState);
  var middlewares = [thunk];

  if (process.env.NODE_ENV !== 'production')
  {
      middlewares.push(createLogger());
  }


  var store = createStore(reducer,
      applyMiddleware(...middlewares)
  );

  // throttle is for update one by sec
  store.subscribe(throttle(() => {
    //updateLocalStorage(store.getState());
  }, 1000));

  return store;
}

export default configureStore;
