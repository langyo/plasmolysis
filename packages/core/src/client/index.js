import connect from './connect';
import register from './register';
import { loadActionModel, requireActionModel } from './actionLoader';
import buildRootNode from './buildRootNode'; 

import { resolve } from 'path';

if (process.env.NODE_ENV === 'production') {
  registerActionModel('nickelcat-preset');
} else {
  registerActionModel(resolve('../../../actions-preset/index.js'));
}

export {
  connect,
  register,
  loadActionModel,
  requireActionModel,
  buildRootNode
};

