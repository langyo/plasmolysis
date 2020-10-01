import {
  IPlatforms
} from '../../core';

import { routeManager } from './routeManager';
import { sessionManager } from './sessionManager';

export function getContexts(platform: IPlatforms): { [key: string]: any } {
  switch (platform) {
    case 'js.browser': return { routeManager };
    case 'js.node': return { sessionManager };
    default: return {};
  }
}

