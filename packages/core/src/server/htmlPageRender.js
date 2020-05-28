import React from 'react';
import { renderToString } from 'react-dom/server';
import { buildRootNode } from '../client';
import {
  getInitializer,
  getPreloader
} from '../lib/modelStore';
import { clearAllState } from '../client/globalState';

import { serverLog as log } from '../utils/logger';
import chalk from 'chalk';

const defaultMetaData = [{
  name: "viewport",
  id: "viewport",
  content: "width=device-width, initial-scale=1"
}];

export default pageType => async ({
  ip, path, query, host, charset, protocol, type, cookies
}, {
  staticClientPath,
  pageTitle,
  allowMobileConsole = true,
  rootGuide: {
    rootComponent,
    rootController,
    initState,
    headProcessor = node => ({
      renderCSS: {},
      renderHTML: renderToString(node),
      renderMeta: defaultMetaData
    })
  }
}) => {
  try {
    // Initialize the data.
    const { payload: payloadRetModelState = {}, globalState: payloadRetGlobalState = {} } = await getPreloader(pageType)({
      ip, path, query, host, charset, protocol, type, cookies
    });
    const renderState = {
      pageType,
      globalState: {
        ...initState,
        ...payloadRetGlobalState
      },
      pagePreloadState: getInitializer(pageType)(payloadRetModelState)
    };
    const rootNode = buildRootNode(rootComponent, rootController, renderState);
    let { renderCSS, renderHTML, renderMeta } = headProcessor(rootNode);

    // Fill the blank parameters.
    if (!renderCSS) renderCSS = {};
    if (!renderHTML) renderHTML = renderToString(rootNode);
    if (!renderMeta) renderMeta = defaultMetaData;

    const body = `
<html>
<head>
<title>
    ${
      typeof pageTitle === 'string' && pageTitle ||
      typeof pageTitle === 'object' && (
        pageTitle[pageType] || ''
      )
      }
</title>
<style>
body {
padding: 0px;
margin: 0px;
}
</style>
    ${
      renderMeta.map(obj =>
        Object.keys(obj)
          .map(key => `${key}="${obj[key]}"`)
          .reduce((prev, next) => `${prev} ${next}`, '')
      ).reduce((str, next) => `${str}
<meta ${next} />`, '')
      }
    ${
      Object.keys(renderCSS)
        .map(id => `<style id="${id}">${renderCSS[id]}</style>`)
        .reduce((prev, next) => prev + next)
      }
<head>
<body>
<div id="root">
${renderHTML}
</div>
<script id="__NICKELCAT_INIT_STATE__">
window.__NICKELCAT_INIT__ = (${JSON.stringify(renderState)});
window.__NICKELCAT_SSR_CSS__ = (${JSON.stringify(Object.keys(renderCSS))});
document.querySelector("#__NICKELCAT_INIT_STATE__").parentElement.removeChild(document.querySelector("#__NICKELCAT_INIT_STATE__"));
</script>
<script src=${staticClientPath}></script>
${allowMobileConsole && `<script>
;(function () {
var src = '//cdn.jsdelivr.net/npm/eruda';
if (!/mobile_dev=true/.test(window.location)) return;
document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();
</script>` || ''}
</body>
</html>`;

    // As the state will be keeped after the next request, we should clear the old state.
    clearAllState();
    
    return { type: 'text/html', statusCode: 200, body };
  } catch (e) {
    log('error', chalk.redBright('Page preload crash'), chalk.yellow(pageType), e);
    
    // As the state will be keeped after the next request, we should clear the old state.
    clearAllState();

    return { type: 'text/html', statusCode: 503, body: `
<html>
<head>
    <title>RUNTIME ERROR</title>
</head>
<body>
<h2>Oops!</h2>
<p>${e.message}</p>
<p>The most likely cause of the error is the invalid parameters passed, or the problem with the server design.</p>
<p>The server has logged the error. We apologize for the inconvenience. :P</p>
</body>
</html>
    `};
  }
};