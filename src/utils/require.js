import { watchDir, readFile, writeFile } from './fileUtil';
import packager from './packager';

const isDemo = process.env.DEMO;

const makePackage = (obj, path) => {
  let bundled = `export default {
    ${Object.keys(obj)
      .map(key => `'${key}': ${obj[key]}`)
      .reduce((p, n) => `${p},\n${n}`)}
  };`;
  writeFile(bundled, path);
}

let controllers = {};
watchDir(isDemo ? `../../demo/${isDemo}/controllers` : `${__dirname}/controllers`, (src, type, path) => {
  if (type !== 'delete') controllers[src] = readFile(src);
  if (type !== 'init') makePackage(controllers, isDemo ? `../../demo/${isDemo}/dist/controllers.js` : `${__dirname}/dist/controllers.js`);
});

let components = {};
watchDir(isDemo ? `../../demo/${isDemo}(/components` : `${__dirname}/components`, (src, type, path) => {
  if (type !== 'delete') components[src] = readFile(src);
  if (type !== 'init') makePackage(components, isDemo ? `../../demo/${isDemo}/dist/components.js` : `${__dirname}/dist/components.js`);
});

let types = readDir('../types');

export { controllers, components, types };
