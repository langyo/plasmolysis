import {
  IPackageInfo
} from '../core/type';
import { sessionManager } from './contexts/nodeServer/sessionManager';
import { routeManager } from './contexts/webClient/routeManager';

export const packageInfo = {
  name: 'preset',

  contexts: {
    webClient: {
      routeManager
    },
    nodeServer: {
      sessionManager
    }
  }
} as IPackageInfo;
