import { readdirSync, statSync, watch } from 'fs';
import { resolve } from 'path';
import { EventEmitter } from 'events';

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
  for (let file of readdirSync(src)) {
    const name = /^(.+)\.js$/.exec(file)[1];
    if (statSync(resolve(src, file)).isDirectory()) dfs(resolve(src, file), `${name}`);
    if (!name) continue;
    else ret[name] = resolve(src, file);
  }
  return ret;
}

// 功能为监视文件夹，包括新建、删除与更新文件
export const watchDir = src => {
  let emitter = new EventEmitter();
  const dfs = (src, path) => {
    let files = readdirSync(src);
    watch(src, (type, file) => {
      if (statSync(resolve(src, file)).isDirectory()) {
        if (file[0] !== '.' && type === 'rename') {
          if (files.indexOf(file) < 0) {
            dfs(resolve(src, file), `${path}.${file}`);
            files.push(file);
          } else {
            files = files.splice(files.indexOf(file), 1);
          }
        }
      } else {
        if (!/^(.+)\.js$/.test(file)) return;
        const name = /^(.+)\.js$/.exec(file)[1];
        if (type === 'rename') {
          if (files.indexOf(file) < 0) {
            // Create a new file.
            files.push(file);
            emitter.emit('create', `${path}.${name}`, resolve(src, file));
          } else {
            // Delete the file.
            files = files.splice(files.indexOf(file), 1);
            emitter.emit('delete', `${path}.${name}`);
          }
        } else {
          // Update the file.
          emitter.emit('update', `${path}.${name}`, resolve(src, file));
        }
      }
    });
  };
  for (let file of files) {
    if (statSync(resolve(src, file)).isDirectory()) {
      dfs(resolve(src, file), file);
    } else {
      if (!/^(.+)\.js$/.test(file)) continue;
      const name = /^(.+)\.js$/.exec(file)[1];
      watch(resolve(src, file), type => {
        if (type === 'update') emitter.emit('update', name, resolve(src, file));
      });
    }
  }
  return emitter;
};

