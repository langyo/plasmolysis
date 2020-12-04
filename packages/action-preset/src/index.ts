export interface IGetters {
  modelType: string,
  modelID: string,
  state: { [key: string]: any },
  globalState: { [key: string]: any },
  pageType: string,
  modelList: { [modelType: string]: string[] }
};

export interface IInitArgs {
  isServerRender: boolean,
  url: {
    path: string,
    query: string,
    fragment: string
  },
  ip: string,
  cookie: {
    [key: string]: string
  },
  callerInfo?: {
    callerPath: string,
    extraData: {
      [key: string]: string
    }
  }
};

export { createModel } from './lib/model/createModel';
export { destoryModel } from './lib/model/destoryModel';
export { setGlobalState } from './lib/model/setGlobalState';
export { setState } from './lib/model/setState';

export { renderReactComponent } from './lib/component/renderReactComponent';
export { renderVueComponent } from './lib/component/renderVueComponent';
export { renderEjsComponent } from './lib/component/renderEjsComponent';
export { renderStaticHtml } from './lib/component/renderStaticHtml';

export { routeHttp } from './lib/route/routeHttp';
export { routeWebSocket } from './lib/route/routeWebSocket';

import { getPlatform } from 'nickelcat/contextManger';
if (getPlatform() === 'js.browser') {
  require('./modelManager');
  require('./stateManager');
}
