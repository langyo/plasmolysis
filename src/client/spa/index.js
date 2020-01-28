import React from 'react';
import { connect, Provider } from 'react-redux';
import { hydrate } from 'react-dom';

import { controllers, configs } from '../staticRequire';
import createStore from './store';
import { pages, models, views } from './connector';

export default () => {
  window.__APP_STATE__ = createStore(window.__APP_STATE__);
  const { renderPage } = window.__APP_STATE__.getState(); 
  
  const timeStampLocal = localStorage.getItem('__NICKEL_TIMESTAMP__') || 0;
  const timeStampRemote = document.cookie.split(';').map(n => n.trim().split('=')).reduce((ret, n) => n[0] === '__NICKEL_TIMESTAMP__' ? n[1] : ret, 0);
  if(timeStampLocal <= timeStampRemote) {
    // Create an extra fetch request.
    fetch(`api/${renderPage}`, {
      credentials: 'same-origin'
    }).then(res => res.json()).then(payload => {
      let dealed =  typeof controllers.pages[renderPage].init === 'function' ? controllers.pages[renderPage].init(payload) : payload;
      dispatch({
        type: 'framework.updateState',
        payload: {
          pages: {
            [renderPage]: dealed
          }
        }
      });
      dispatch({
        type: 'global.initialize',
        payload: dealed
      });
    }).catch(err => {
      dispatch({
        type: 'global.initializeFail',
        payload: err
      });
    });
  } else {
    dispatch({
      type: 'global.initialize',
      payload: window.__APP_STATE__.getState().pages[renderPage]
    })
  }

  hydrate(document.querySelector('#nickelcat-pages'), <Provider store={window.__APP_STATE__}>
    {React.createElement(pages[renderPage], { key: renderPage })}
</Provider>);
  hydrate(document.querySelector('#nickelcat-views'),
<Provider store={window.__APP_STATE__}>
</Provider>);
  hydrate(document.querySelector('#nickelcat-models'),
<Provider store={window.__APP_STATE__}>
</Provider>);
);
};
