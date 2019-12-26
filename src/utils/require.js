import { watchDir, readFile } from './fileUtil';

const isDemo = process.env.DEMO;

let controllers = {};
watchDir(isDemo ? `../../demo/${isDemo(}/controllers` : `${__dirname}/controllers`, (src, type, path) => type !== 'delete' && controllers[src] = readFile(src));

let components = {};
watchDir(isDemo ? `../../demo/${isDemo(}/components` : `${__dirname}/components`, (src, type, path) => type !== 'delete' && components[src] = readFile(src));

let types = readDir('../types');

export { controllers, components, types };
