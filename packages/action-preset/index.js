import _createModel from './lib/createModel';
import _deal from './lib/deal';
import _destoryModel from './lib/destoryModel';
import _dispatch from './lib/dispatch';
import _fetch from './lib/fetch';
import _setData from './lib/setData';
import _setState from './lib/setState';
import _togglePage from './lib/togglePage';
import _wait from './lib/wait';

export default {
  $packageName: 'preset',
  $actions: {
    createModel: _createModel,
    deal: _deal,
    destoryModel: _destoryModel,
    dispatch: _dispatch,
    fetch: _fetch,
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

export const createModel = _createModel.creator;
export const deal = _deal.creator;
export const destoryModel = _destoryModel.creator;
export const dispatch = _dispatch.creator;
export const fetch = _fetch.creator;
export const setData = _setData.creator;
export const setState = _setState.creator;
export const togglePage = _togglePage.creator;
export const wait = _wait.creator;
