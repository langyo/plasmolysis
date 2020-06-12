import {
  initRoutes,
  getRoutes
} from 'nickelcat/server';
import createModelManager from 'nickelcat/lib/modelManager';

const { components, services, configs } = require('./.requirePackages.js');
const modelManager = createModelManager(components);

import presetActionPackage from 'nickelcat-action-preset';
import { loadActionModel } from 'nickelcat/lib/actionLoader';
loadActionModel(presetActionPackage);

let initState = Object.seal(configs.initState);
let extraConfigs = Object.seal(configs.index);
initRoutes(extraConfigs, modelManager);

import { router } from 'nickelcat/server';
import { childCreator } from './childProcessCreator';

import { renderToString } from 'react-dom/server';
import { ServerStyleSheets } from '@material-ui/core/styles';

childCreator(async ({
  type,
  payload,
  configs
}) => {
  try {
    const ret = await router(type, payload, getRoutes(), {
      ...configs,
      ...extraConfigs,
      rootGuide: {
        modelManager,
        initState,
        headProcessor: nodes => {
          const sheets = new ServerStyleSheets();
          const html = Object.keys(nodes).reduce((str, id) => `
            ${str}
            <div id="${id}">
              ${renderToString(sheets.collect(nodes[id]))}
            </div>
          `, '');

          return {
            renderHTML: html,
            renderCSS: {
              'ssr-css': sheets.toString()
            }
          }
        }
      },
      targetElementID: 'nickelcat-root'
    });
    return ret;
  } catch (e) {
    return {
      successFlag: true,
      payload: {
        type: 'text/html', statusCode: 404, body: `
<html>
<head>
    <title>RUNTIME ERROR</title>
</head>
<body>
  <h2>Oops!</h2>
  <p>${e.message}</p>
  <p>Cannot find the resources. :(</p>
  </body>
</html>
      `}
    };
  }
})