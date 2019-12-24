import { createStore, applyMiddleware } from 'redux';

import reducer from './reducer';

import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export default createStore(reducer, composeWithDevTools(applyMiddleware(logger, thunk)));
