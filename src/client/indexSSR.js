import React from 'react';
import { connect, Provider } from 'react-redux';
import { hydrate } from 'react-dom';

import { configs } from '../staticRequire';
import store from './store';
import { pages, models, views } from './connector';

export default () => {
  if(window.__renderMode === 'spa') return;
  window.__renderMode = 'ssr';
  window.__store = store(window.__initState);

  const { renderPage } = window.__init; 
  
  hydrate(document.querySelector('#nicklecat-pages'), <Provider store={window.__store}>
    {React.createElement(pages[renderPage], this.props.hasInitialized ? { key: renderPage } : { key: renderPage, ...this.props.pageData })}
  </Provider>)
};