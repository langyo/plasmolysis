import { PackageInfo } from '../core/type';

import * as webClient_createModel from './actions/webClient/createModel';
import * as webClient_deal from './actions/webClient/deal';
import * as webClient_destoryModel from './actions/webClient/destoryModel';
import * as webClient_dispatch from './actions/webClient/dispatch';
import * as webClient_setGlobalState from './actions/webClient/setGlobalState';
import * as webClient_setState from './actions/webClient/setState';
import * as webClient_togglePage from './actions/webClient/togglePage';
import * as webClient_wait from './actions/webClient/wait';

import * as nodeServer_deal from './actions/nodeServer/deal';
import * as nodeServer_wait from './actions/nodeServer/wait';

import * as fetch from './bridges/fetch';

export default <PackageInfo> {
  name: 'preset',
  description: 'The core action package.',
  author: 'langyo',
  repository: 'https://github.com/langyo/nickelcat.git',

  actions: {
    webClient: {
      createModel: webClient_createModel,
      deal: webClient_deal,
      destoryModel: webClient_destoryModel,
      dispatch: webClient_dispatch,
      setGlobalState: webClient_setGlobalState,
      setState: webClient_setState,
      togglePage: webClient_togglePage,
      wait: webClient_wait
    },
    nodeServer: {
      deal: nodeServer_deal,
      wait: nodeServer_wait
    }
  },

  bridges: {
    webClient: {
      nodeServer: {
        fetch
      }
    }
  }
};
