export { pushHead } from './lib/service/pushHead';
export { pushContent } from './lib/service/pushContent';

export { renderReactComponent } from './lib/render/renderReactComponent';
export { renderVueComponent } from './lib/render/renderVueComponent';
export { renderEjsComponent } from './lib/render/renderEjsComponent';
export { renderStaticHtml } from './lib/render/renderStaticHtml';

import { getPlatform } from 'nickelcat/contextManager';
if (getPlatform() === 'js.browser') {
  require('./routeManager');
} else if (getPlatform() === 'js.node') {
  require('./sessionManager');
}
