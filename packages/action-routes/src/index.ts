export { routeHttp } from './lib/backend/routeHttp';
export { routeWebSocket } from './lib/backend/routeWebSocket';

export { pushHead } from './lib/service/pushHead';
export { pushContent } from './lib/service/pushContent';
export { routeToStatic } from './lib/service/routeToStatic';
export { routeToService } from './lib/service/routeToService';
export { renderComponent } from './lib/service/renderComponent';

export { togglePage } from './lib/frontend/togglePage';
export { renderReactComponent } from './lib/frontend/renderReactComponent';
export { renderVueComponent } from './lib/frontend/renderVueComponent';
export { renderEjsComponent } from './lib/frontend/renderEjsComponent';
export { renderStaticHtml } from './lib/frontend/renderStaticHtml';

import { getPlatform } from 'nickelcat/contextManager';
if (getPlatform() === 'js.browser') {
  require('./routeManager');
} else if (getPlatform() === 'js.node') {
  require('./sessionManager');
}
