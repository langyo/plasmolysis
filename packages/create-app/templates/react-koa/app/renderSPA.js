import React from 'react';
import { hydrate } from 'react-dom';
import {
  connect,
  register,
  buildRootNode
} from 'nickelcat';

import Index from './components/index';
import indexCtr from './controllers/index';
connect(Index, indexCtr, 'index');

register('index');

hydrate(document.querySelector('#root'), buildRootNode());

