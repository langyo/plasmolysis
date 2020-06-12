import React from 'react';
import { hydrate } from 'react-dom';
import { buildRootNode } from 'nickelcat/client';
import createModelManager from 'nickelcat/lib/modelManager';

const { components, services } = require('./.requirePackages.js');
const modelManager = createModelManager(components);

import presetActionPackage from 'nickelcat-action-preset';
import { loadActionModel } from 'nickelcat/lib/actionLoader';
loadActionModel(presetActionPackage);

const nodes = buildRootNode({
  modelManager,
  ...window.__NICKELCAT_INIT__,
  targetElementID: 'nickelcat-root'
});
for (const id of Object.keys(nodes)) {
  hydrate(nodes[id], document.querySelector(`#${id}`));
}

const ssrStyles = document.querySelector('#ssr-css');
if (ssrStyles) {
  ssrStyles.parentElement.removeChild(ssrStyles);
}
