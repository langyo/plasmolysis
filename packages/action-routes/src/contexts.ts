import {
  IPlatforms
} from '../../core';

import * as routeManager from './routeManager';
import * as sessionManager from './sessionManager';

export function getContexts(platform: IPlatforms): { [key: string]: any } {
  switch (platform) {
    case 'js.browser': return { routeManager };
    case 'js.node': return { sessionManager };
    default: return {};
  }
}

