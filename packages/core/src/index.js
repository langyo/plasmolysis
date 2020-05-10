import client, {
  connect,
  register,
  loadActionModel,
  buildRootNode
} from './client/index';

import actionPreset from './action-preset';
loadActionModel(actionPreset);

export default client;

export {
  connect,
  register,
  loadActionModel,
  buildRootNode
};

