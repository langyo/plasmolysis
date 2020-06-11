import {
  initRoutes,
  getRoutes
} from 'nickelcat/server';
import { loadActionModel } from 'nickelcat/client';

const { components, services, configs } = require('./.requirePackages.js');

import presetActionPackage from 'nickelcat-action-preset';
loadActionModel(presetActionPackage);

let initState = Object.seal(configs.initState);
let extraConfigs = Object.seal(configs.index);
initRoutes(extraConfigs);

import { router } from 'nickelcat/server';
import { childCreator } from './childProcessCreator';

import { renderToString } from 'react-dom/server';
import { ServerStyleSheets } from '@material-ui/core/styles';

childCreator(async ({
  type,
  payload,
  configs
}) => await router(type, payload, getRoutes(), {
  ...configs,
  ...extraConfigs,
  rootGuide: {
    components,
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
  targetElement: document.querySelector('#nickelcat-root')
}));
