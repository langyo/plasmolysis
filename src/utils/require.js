import { watchDir, readFile } from './fileUtil';

const isDemo = process.env.DEMO;

let controllers = {};
watchDir(isDemo ? `../../demo/${isDemo(}/controllers` : '../../../controllers', (src, type, path) => type !== 'delete' && controllers[src] = readFile(src)) : watchDir('../../../controllers');

let components = {};
watchDir(isDemo ? `../../demo/${isDemo(}/components` : '../../../components', (src, type, path) => type !== 'delete' && components[src] = readFile(src)) : watchDir('../../../components');

let types = readDir('../types');

export { controllers, components, types };
