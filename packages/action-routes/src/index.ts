export { togglePage } from './lib/frontend/togglePage';

export { routeHttp } from './lib/protocol/routeHttp';
export { routeWebSocket } from './lib/protocol/routeWebSocket';

export { pushHead } from './lib/service/pushHead';
export { pushContent } from './lib/service/pushContent';
export { routeToStatic } from './lib/service/routeToStatic';
export { routeToService } from './lib/service/routeToService';
export { renderComponent } from './lib/service/renderComponent';

import { getPlatform } from 'nickelcat/contextManager';
if (getPlatform() === 'js.browser') {
  require('./routeManager');
} else if (getPlatform() === 'js.node') {
  require('./sessionManager');
}
