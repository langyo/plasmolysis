import { resolve } from 'path';
import { watch, readdirSync, statSync, accessSync, writeFile } from 'fs';

const envDemo = process.env.DEMO;

export const workDirPath = resolve(envDemo ? `${process.cwd()}/demo/${envDemo}` : `${process.cwd()}`);
export const distPath = resolve(__dirname, '../staticRequire.js');

export const context = require(envDemo ? `${process.cwd()}/demo/${envDemo}/server/context.js` : `${process.cwd()}/server/context.js`);

// Declare some util functions.
const deepDec = (obj, path, value = null) => {
  const dfs = (obj, path, value) => path.length === 1 ? ({ ...obj, [path[0]]: value }) : ({ ...obj, [path[0]]: dfs(obj[path[0]] || {}, [...path].splice(1), value) });
  dfs(deepDec(obj, path, value));
}

const scanDir = src => {
  let ret = {};
  const dfs = (src, path) => {
    for (let file of readdirSync(src)) {
      const name = file.substr(0, file.lastIndexOf('.'));
      if (statSync(resolve(src, file)).isDirectory()) dfs(resolve(src, file), `${path}.${name}`);
      if (!name) continue;
      else {
        const required = require(resolve(src, file));
        ret[`${path}.${name}`] = required.default ? { ...required.default } : required;
      }
    }
  };
  for (let file of readdirSync(src)) {
    const name = file.substr(0, file.lastIndexOf('.'));
    if (statSync(resolve(src, file)).isDirectory()) dfs(resolve(src, file), `${name}`);
    if (!name) continue;
    else {
      const required = require(resolve(src, file));
      ret[name] = required.default ? { ...required.default } : required;
    }
  }
  return ret;
};

const watchDir = (src, path = [], deepLength = 1) => {
  for (let file of readdirSync(resolve(src))) {
    if (statSync(resolve(src, file)).isDirectory()) {
      watchDir(resolve(src, file), [...path, file]);
    } else {
      const name = file.substr(0, file.lastIndexOf('.'));
      watch(resolve(src, file), type => {
        const currentPath = [...path, name];
        const deepPath = [...currentPath.splice(0, deepLength), currentPath.splice(deepLength).join('.')];
        switch (type) {
          case 'update':
            const required = require(resolve(src, file));
            packages = deepDec(packages, deepPath, required.default ? { ...required.default } : required);
            break;
          case 'delete':
            packages = deepDec(packages, deepPath);
            break;
          default:
        }
      });
    }
  }
  watch(resolve(src), (type, file) => {
    if (type === 'create') {
      if (statSync(resolve(src, file)).isDirectory()) {
        watchDir(resolve(src, file), [...path, file])
      } else {
        const name = file.substr(0, file.lastIndexOf('.'));
        const currentPath = [...path, name];
        const deepPath = [...currentPath.splice(0, deepLength), currentPath.splice(deepLength).join('.')];
        const required = require(resolve(src, file));
        packages = deepDec(packages, deepPath, required.default ? { ...required.default } : required);
      }
    }
  });
}

// Initial the packages what will be exported.
let packages = {
  components: {
    views: scanDir(resolve(workDirPath, 'components/views')),
    pages: scanDir(resolve(workDirPath, 'components/pages')),
    models: scanDir(resolve(workDirPath, 'components/models'))
  },
  controllers: {
    views: scanDir(resolve(workDirPath, 'controllers/views')),
    pages: scanDir(resolve(workDirPath, 'controllers/pages')),
    models: scanDir(resolve(workDirPath, 'controllers/models'))
  },
  actions: scanDir(resolve('../actions')),
  configs: require(resolve(workDirPath, 'nickel.config.js')).default
};

// Deal the file 'nickel.config.js'.
try {
  accessSync(resolve(workDirPath, 'nickel.config.js'));
} catch (e) {
  throw new Error('You must provide a configuration file.');
}
packages.configs = require(resolve(workDirPath, 'nickel.config.js')).default;
watch(resolve(workDirPath, 'nickel.config.js'), type => {
  if (type === 'update') {
    packages.configs = require(resolve(workDirPath, 'nickel.config.js')).default;
    packageBundle();
  }
});

// Deal the other files.
watchDir(resolve(workDirPath, 'components'), ['components'], 2);
watchDir(resolve(workDirPath, 'controllers'), ['controllers'], 2);
watchDir(resolve('../actions'), ['actions'], 1);

export { packages };

function packageBundle() {
  writeFile(distPath,
    `// Unless you know what you are doing now, DON'T modify this file!
export const components = {
  views: { ${
    Object.keys(componentViews)
      .map(key => `'${key}': require(\`${resolve(componentViews[key]).split('\\').join('/')}\`).default, `)
      .join('')
    } },
  pages: { ${
    Object.keys(componentPages)
      .map(key => `'${key}': require(\`${resolve(componentPages[key]).split('\\').join('/')}\`).default, `)
      .join('')
    } },
  models: { ${
    Object.keys(componentModels)
      .map(key => `'${key}': require(\`${resolve(componentModels[key]).split('\\').join('/')}\`).default, `)
      .join('')
    } }
};

export const controllers = {
  views: { ${
    Object.keys(controllerViews)
      .map(key => `'${key}': require(\`${resolve(controllerViews[key]).split('\\').join('/')}\`).default, `)
      .join('')
    } },
  pages: { ${
    Object.keys(controllerPages)
      .map(key => `'${key}': require(\`${resolve(controllerPages[key]).split('\\').join('/')}\`).default, `)
      .join('')
    } },
  models: { ${
    Object.keys(controllerModels)
      .map(key => `'${key}': require(\`${resolve(controllerModels[key]).split('\\').join('/')}\`).default, `)
      .join('')
    } }
};

export const actions = {
  client: { ${
    // 记得处理未定义 client 键的情况！
    Object.keys(actions)
      .map(key => `'${key}': require(\`${resolve(actions[key]).split('\\').join('/')}\`).client,`)
      .join('')
    } },
  \$: { ${
    Object.keys(actions)
      .map(key => `'${key}': require(\`${resolve(actions[key]).split('\\').join('/')}\`).$,`)
      .join('')
    } }
};

export const configs = require(\`${resolve(workDirPath, 'nickel.config.js').split('\\').join('/')}\`).default;
`,
    'utf-8',
    () => { console.log('Bundled file has been updated.'); }
  );
};
