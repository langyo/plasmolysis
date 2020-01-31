import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';

export default ({ store, Page, Views, extraBodyString }) => `
${extraBodyString || ''}
<div id="nickelcat-pages">
${renderToString(<Provider store={store}>
  {Page}
</Provider>)}
</div>
<div id="nickelcat-views">
${renderToString(<Provider store={store}>
  {Views}
</Provider>)}
</div>
<div id="nickelcat-models"></div>
`;

