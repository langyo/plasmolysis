/// <reference path="../core/type.d.ts" />

// TODO
import * as togglePageAction from './actions/webClient/togglePage';
import { sessionManager } from './contexts/nodeServer/sessionManager';
import { routeManager } from './contexts/webClient/routeManager';

export const packageInfo = <PackageInfo>{
  name: 'preset',
  description: 'The core action package.',
  author: 'langyo',
  repository: 'https://github.com/langyo/nickelcat.git',

  actions: {
    webClient: {
      togglePage: togglePageAction
    }
  },
  contexts: {
    webClient: {
      routeManager
    },
    nodeServer: {
      sessionManager
    }
  }
};
