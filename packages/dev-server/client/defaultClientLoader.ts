import nodeRender from './clientNodeRender';
import createModelManager from 'nickelcat/lib/modelManager';

import presetActionPackage from 'nickelcat-action-preset';
import createActionMangager from 'nickelcat/lib/actionManager';
const actionManager = createActionMangager(presetActionPackage);

const { components, services } = require('./__nickelcat_staticRequire.js');
const modelManager = createModelManager(components, actionManager);

nodeRender(
  JSON.parse((<any>document.getElementById('nickelcat-server-side-data')).value || {})
);
