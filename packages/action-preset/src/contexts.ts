import {
  IPlatforms
} from '../../core';

import * as modelManager from './modelManager';
import * as stateManager from './stateManager';

export { IGlobalState } from './stateManager';

export function getContexts(platform: IPlatforms): { [key: string]: any } {
  switch (platform) {
    case 'js.browser': return { modelManager, stateManager };
    case 'js.node': return { modelManager };
    default: return {};
  }
}
