export interface ISessionVariants {
  id: string,
  url: {
    path: string,
    query: string,
    fragment: string
  },
  ip: string,
  cookie: {
    [key: string]: string
  },
  lastVerifyTime: Date,
  lastVerifyString: string
};

export interface IModelVariants {
  id: string,
  type: string,
  state: { [key: string]: unknown },
  globalState: { [key: string]: unknown },
  modelLists: { [type: string]: string }
};

export { createModel } from './lib/model/createModel';
export { destoryModel } from './lib/model/destoryModel';
export { setGlobalState } from './lib/model/setGlobalState';
export { setState } from './lib/model/setState';

export { pushHead } from './lib/service/pushHead';
export { pushContent } from './lib/service/pushContent';

export { renderReactComponent } from './lib/render/renderReactComponent';
export { renderVueComponent } from './lib/render/renderVueComponent';
export { renderEjsComponent } from './lib/render/renderEjsComponent';
export { renderStaticHtml } from './lib/render/renderStaticHtml';

