import { hydrate } from 'react-dom';

import { controllers } from '../staticRequire';
import SPAComponent from './component';

export default () => {
  const { renderPage } = window.__APP_STATE__;

  const timeStampLocal = localStorage.getItem('__NICKEL_TIMESTAMP__') || 0;
  const timeStampRemote = document.cookie.split(';').map(n => n.trim().split('=')).reduce((ret, n) => n[0] === '__NICKEL_TIMESTAMP__' ? n[1] : ret, 0);
  if (timeStampLocal <= timeStampRemote) {
    // Create an extra fetch request.
    fetch(`api/${renderPage}`, {
      credentials: 'same-origin'
    }).then(res => res.json()).then(payload => {
      let dealed = typeof controllers.pages[renderPage]({}).init === 'function' ? controllers.pages[renderPage]({}).init(payload) : payload;
      hydrate(document.querySelector('#nickelcat-root'), SPAComponent({
        ...window.__APP_STATE__,
        pages: {
          [renderPage]: dealed
        },
        data: { ...window.__APP_STATE__.data, connectionType: 'spa' }
      }));
    }).catch(err => {
      hydrate(document.querySelector('#nickelcat-root'), SPAComponent({
        ...window.__APP_STATE__,
        data: { ...window.__APP_STATE__.data, connectionType: 'spa-offline' }
      }));
    });
  } else {
    hydrate(document.querySelector('#nickelcat-root'), SPAComponent({
      ...window.__APP_STATE__,
      data: { ...window.__APP_STATE__.data, connectionType: 'ssr' }
    }));
  }
};
