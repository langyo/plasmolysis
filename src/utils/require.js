import { readDir } from './fileUtil';

const isDemo = process.env.DEMO != null;

let controllers = isDemo ? readDir('../../demo/controllers') : readDir('../../../controllers');
let components = isDemo ? readDir('../../demo/components') : readDir('../../../components');

let types = readDir('../types');

// DEMO: Watch the files.

export { controllers, components, types };
