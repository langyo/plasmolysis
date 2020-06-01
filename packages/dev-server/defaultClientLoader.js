import React from 'react';
import { hydrate } from 'react-dom';
import {
  connect,
  register,
  buildRootNode,
  loadActionModel
} from 'nickelcat/client';

const { components, services } = require('./.requirePackages.js');

import presetActionPackage from 'nickelcat-action-preset';
loadActionModel(presetActionPackage);

for (const name of Object.keys(components).filter(name => name !== 'index')) {
  connect(components[name].component.default, components[name].controller.default, name);
}

register(
  window.__NICKELCAT_INIT__.pageType,
  window.__NICKELCAT_INIT__.pagePreloadState,
  '$page'
);

if (!components.index) throw new Error('TODO: Support the multi pages without the route index component.');
hydrate(buildRootNode(
  components.index.component.default,
  components.index.controller.default,
  window.__NICKELCAT_INIT__ || {}
), document.querySelector('#root'));

const ssrStyles = document.querySelector('#ssr-css');
if (ssrStyles) {
  ssrStyles.parentElement.removeChild(ssrStyles);
}
