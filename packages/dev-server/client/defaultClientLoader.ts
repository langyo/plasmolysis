/// <reference path="../type.d.ts" />

import nodeRender from './clientNodeRender';
import createModelManager from 'nickelcat/lib/modelManager';

import { packageInfo } from 'nickelcat-action-preset';
import createActionMangager from 'nickelcat/lib/actionManager';
const actionManager = createActionMangager(packageInfo);

const { components, services } = require('./__nickelcat_staticRequire.js');
const modelManager = createModelManager(components, actionManager);

nodeRender(
  JSON.parse((<any>document.getElementById('nickelcat-server-side-data')).value || {})
);
