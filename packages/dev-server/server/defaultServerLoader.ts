import presetActionPackage from 'nickelcat-action-preset';
import { actionManager } from 'nickelcat';

actionManager.loadPackage(require('./__nickelcat_staticRequire.js'));

import { renderToString } from 'react-dom/server';
import { ServerStyleSheets } from '@material-ui/core/styles';

declare global {
  export const __payload: {
    type: string,
    payload:{ [key: string]: any },
    configs:{ [key: string]: any }
  };
  export const __callback: (ret:{ [key: string]: any }) => void;
};

const { type, payload, configs } = __payload;
try {
  const ret = await router(type, payload, getRoutes(), {
    ...configs,
    ...extraConfigs,
    rootGuide: {
      modelManager,
      initState,
      headProcessor: nodes => Object.keys(nodes).map(id => {
        const sheets = new ServerStyleSheets();
        return {
          html: `
              <div id="${id}">
                ${renderToString(sheets.collect(nodes[id]))}
              </div>
            `,
          css: sheets.toString()
        };
      }).reduce(({ renderHTML, renderCSS }, { html, css }) => ({
        renderHTML: renderHTML + html,
        renderCSS: { 'ssr-css': renderCSS['ssr-css'] + '\n' + css }
      }), { renderHTML: '', renderCSS: { 'ssr-css': '' } })
    },
    targetElementID: 'nickelcat-root'
  }, actionManager);
  return ret;
} catch (e) {
  __callback({
    hasContentFlag: true,
    payload: {
      type: 'text/html', statusCode: 404, body: `
<html>
<head>
    <title>RUNTIME ERROR</title>
</head>
<body>
  <h2>Oops!</h2>
  <p>${e.message}</p>
  </body>
</html>
    `})
};
}