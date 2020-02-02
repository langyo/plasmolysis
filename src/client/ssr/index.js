import React from 'react';
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux';

import storeCreator from './store';
import componentToString from './component';

export default async ({ renderPage, pagePreloader, globalPreloader, Page, Views, context, cookies, pageParams, headers}) => {
  let store = storeCreator(renderPage, { headers, cookies });
 
  let pagePreload = typeof pagePreloader === 'function' ? await pagePreloader(context, cookies, pageParams, headers) : pagePreloader;
  store.dispatch({
    type: 'framework.updateState',
    payload: {
      pages: {
        [renderPage]: pagePreload || {}
      }
    }
  });
  let { preload : globalPreload, extraHeadString, extraBodyString } = typeof globalPreloader === 'function' ? await globalPreloader(context, cookies, pageParams, { Page, Views }, headers) : globalPreloader;
  store.dispatch({
    type: 'framework.updateState',
    payload: {
      data: globalPreload || {}
    }
  });

  return {
    str: `${componentToString({ store, Page, Views, extraBodyString })}
<script>
window.__APP_STATE__ = JSON.parse(${store.getState()}); 
</script>`,
    head: extraHeadString || ''
  };
};

