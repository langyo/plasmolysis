export { pushHead } from './lib/pushHead';
export { pushContent } from './lib/pushContent';
export { routeToStatic } from './lib/routeToStatic';
export { routeToService } from './lib/routeToService';
export { renderComponent } from './lib/renderComponent';
export { togglePage } from './lib/togglePage';

import { getPlatform } from 'nickelcat/contextManager';
if (getPlatform() === 'js.browser') {
  require('./routeManager');
} else if (getPlatform() === 'js.node') {
  require('./sessionManager');
}
