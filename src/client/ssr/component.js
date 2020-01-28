import React, { createElement } from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom';

import { pages, views } from './connector';

export default ({ store, Page, Views, extraBodyString }) => `
${extraBodyString || ''}
<div id="nickelcat-pages">
${renderToString(<Provider store={store}>
  <PageComponent />
</Provider>)}
</div>
<div id="nickelcat-views">
${renderToString(<Provider store={store}>
  <ViewComponents />
</Provider>)}
</div>
<div id="nickelcat-models"></div>
`;

