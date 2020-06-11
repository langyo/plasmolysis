import React from 'react';
import { hydrate } from 'react-dom';
import {
  buildRootNode,
  loadActionModel
} from 'nickelcat/client';

const { components, services } = require('./.requirePackages.js');

import presetActionPackage from 'nickelcat-action-preset';
loadActionModel(presetActionPackage);

const nodes = buildRootNode({
  components,
  ...window.__NICKELCAT_INIT__,
  targetElement
});
for (const id of Object.keys(nodes)) {
  hydrate(nodes[id], document.querySelector(`#${id}`));
}

const ssrStyles = document.querySelector('#ssr-css');
if (ssrStyles) {
  ssrStyles.parentElement.removeChild(ssrStyles);
}
