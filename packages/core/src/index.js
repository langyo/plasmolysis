import serverMiddleware from './serverMiddleware';
import connect from './connect';
import register from './register';
import { loadActionModel, requireActionModel } from './actionLoader';

import { resolve } from 'path';

if (process.env.NODE_ENV === 'production') {
  registerActionModel('nickelcat-preset');
} else {
  registerActionModel(resolve('../../actions-preset/index.js'));
}

export {
  serverMiddleware,
  connect,
  register,
  loadActionModel,
  requireActionModel
};

