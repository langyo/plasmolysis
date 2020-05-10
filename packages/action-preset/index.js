import _createModel from './lib/createModel';
import _deal from './lib/deal';
import _destoryModel from './lib/destoryModel';
import _dispatch from './lib/dispatch';
import _setData from './lib/setData';
import _setState from './lib/setState';
import _togglePage from './lib/togglePage';
import _wait from './lib/wait';

import creatorFactory from './creatorFactory';

export default {
  $packageName: 'preset',
  $actions: {
    createModel: _createModel,
    deal: _deal,
    destoryModel: _destoryModel,
    dispatch: _dispatch,
    setData: _setData,
    setState: _setState,
    togglePage: _togglePage,
    wait: _wait
  },
  $routers: {
    server: {
      http: async (payload, routes, configs) => {
        if (!routes[payload.path]) return;
        return await routes[payload.path](payload, configs);
      }
    }
  }
};

export const createModel = creatorFactory('createModel', _createModel);
export const deal = creatorFactory('deal', _deal);
export const destoryModel = creatorFactory('destoryModel', _destoryModel);
export const dispatch = creatorFactory('dispatch', _dispatch);
export const setData = creatorFactory('setData', _setData);
export const setState = creatorFactory('setState', _setState);
export const togglePage = creatorFactory('togglePage', _togglePage);
export const wait = creatorFactory('wait', _wait);
