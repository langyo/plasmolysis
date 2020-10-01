import {
  IPlatforms
} from '../../core';

import { modelManager } from './modelManager';
import { stateManager } from './stateManager';

export { IGlobalState } from './stateManager';

export function getContexts(platform: IPlatforms): { [key: string]: any } {
  switch (platform) {
    case 'js.browser': return { modelManager, stateManager };
    case 'js.node': return { modelManager };
    default: return {};
  }
}
