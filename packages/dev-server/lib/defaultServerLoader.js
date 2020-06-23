import {
  initRoutes,
  getRoutes
} from 'nickelcat/server/register';
import createModelManager from 'nickelcat/lib/modelManager';
import { serverLog as log } from 'nickelcat/utils/logger';

import presetActionPackage from 'nickelcat-action-preset';
import createActionMangager from 'nickelcat/lib/actionManager';
const actionManager = createActionMangager(presetActionPackage);

const { components, services, configs } = require('./__nickelcat_staticRequire.js');
const modelManager = createModelManager(components, actionManager);

let initState = Object.seal(configs.initState);
let extraConfigs = Object.seal(configs.index);
initRoutes(extraConfigs, modelManager, actionManager);

import router from 'nickelcat/server/router';
import { childCreator } from './__nickelcat_childProcessCreator';

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
        // headProcessor: nodes => {
        //   const sheets = new ServerStyleSheets();
        //   const html = Object.keys(nodes).reduce((str, id) => `
        //     ${str}
        //     <div id="${id}">
        //       ${renderToString(sheets.collect(nodes[id]))}
        //     </div>
        //   `, '');

        //   return {
        //     renderHTML: html,
        //     renderCSS: {
        //       'ssr-css': sheets.toString()
        //     }
        //   }
        // }
      },
      targetElementID: 'nickelcat-root'
    }, actionManager);
    return ret;
  } catch (e) {
    log('error', e);
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
  </body>
</html>
      `}
    };
  }
})