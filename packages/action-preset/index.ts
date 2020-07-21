import { translator as webClient_createModel } from './actions/webClient/createModel';
import { translator as webClient_deal } from './actions/webClient/deal';
import { translator as webClient_destoryModel } from './actions/webClient/destoryModel';
import { translator as webClient_dispatch } from './actions/webClient/dispatch';
import { translator as webClient_setGlobalState } from './actions/webClient/setGlobalState';
import { translator as webClient_setState } from './actions/webClient/setState';
import { translator as webClient_togglePage } from './actions/webClient/togglePage';
import { translator as webClient_wait } from './actions/webClient/wait';

export {
  webClient_createModel as createModel,
  webClient_deal as deal,
  webClient_destoryModel as destoryModel,
  webClient_dispatch as dispatch,
  webClient_setGlobalState as setGlobalState,
  webClient_setState as setState,
  webClient_togglePage as togglePage,
  webClient_wait as wait
};

import { translator as bridge_fetch } from './bridges/fetch';

export {
  bridge_fetch as fetch
};

import { translator as nodeServer_deal } from './actions/nodeServer/deal';
import { translator as nodeServer_wait } from './actions/nodeServer/wait';

export const server = {
  deal: nodeServer_deal,
  wait: nodeServer_wait
};
