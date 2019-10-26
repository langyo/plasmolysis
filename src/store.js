import { createStore, applyMiddleware } from 'redux';

import reducer from './reducer';

import thunk from 'redux-thunk';
import logger from 'redux-logger';

export default createStore(reducer, applyMiddleware(logger, thunk));
