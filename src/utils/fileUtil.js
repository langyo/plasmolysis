import { readdirSync, statSync, watch } from 'fs';
import { resolve } from 'path';

// 功能为初始化项目而进行完整扫描，并提供文件路径对应
export const scanDir = src => {
  let ret = {};
  const dfs = (src, path) => {
    for (let file of readdirSync(src)) {
      const name = /^(.+)\.js$/.exec(file)[1];
      if (statSync(resolve(src, file)).isDirectory()) dfs(resolve(src, file), `${path}.${name}`);
      if (!name) continue;
      else ret[`${path}.${name}`] = resolve(src, file);
    }
  };
  for (let file of readdirSync(src)) {       const name = /^(.+)\.js$/.exec(file)[1];
    if (statSync(resolve(src, file)).isDirectory()) dfs(resolve(src, file), `${name}`);
    if (!name) continue;
    else ret[name] = resolve(src, file);
  }
  return ret;
}

// 功能为监视文件夹，包括新建、删除与更新文件
export const watchDir = (src, callback) => {
  const dfs;
  // Developing
  for (let file of readdirSync(src)) {
    if (statSync(resolve(src, file)).isDirectory()) {
      let subFiles = '';
      fs.watch(`${src}/${file}/`, (type, name) => {
        if (type === 'rename') {
          if(subFiles.indexOf(name) < 0) {
            // New file.
            subFiles.push(name);
            callback(`${src}/${file}/${name}`, 'create', `${path}.${name}`.substr(1));
          } else {
            // Delete File.
            subFiles.splice(subFiles.indexOf(name), subFiles.indexOf(name) + 1);
            callback(`${src}/${file}/${name}`, 'delete', `${path}.${name}`.substr(1));
          }
        }
      })
    }
    else {
      fs.watchFile(`${src}/${file}`, (cur, prev) => {
        callback(`${src}/${file}`, 'update', `${path}.${file}`.substr(1));
      });
      callback(`${src}/${file}`, 'init', `${path}.${file}`.substr(1));
    }
  }
  return files;
};

