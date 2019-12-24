import fs from 'fs';

export const copyFile = (src, target) => {
  fs.writeFileSync(target, fs.readFileSync(src));
};

export const copyDir = (src, target) => {
  if (!fs.existsSync(target)) fs.mkdirSync(target);
  let files = fs.readdirSync(src);
  for (let file of files) {
    if (fs.statSync(`${src}/${file}`).isDirectory()) copyDir(`${src}/${file}`, `${target}/${file}`);
    else copyFile(`${src}/${file}`, `${target}/${file}`);
  }
};

export const readDir = src => {
  let files = fs.readdirSync(src);
  let ret = {};
  for (let file of files) {
    if (fs.statSync(`${src}/${file}`).isDirectory()) ret[file] = readDir(`${src}/${file}`);
    else ret[file] = fs.readFileSync(`${src}/${file}`);
  }
  return ret;
}

export const watchDir = (src, callback, path = '.') => {
  let files = fs.readdirSync(src);
  for (let file of files) {
    if (fs.statSync(`${src}/${file}`).isDirectory()) {
      let subFiles = watchDir(`${src}/${file}`, `${target}/${file}`, `${path}.${file}`);
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
    else fs.watchFile(`${src}/${file}`, (cur, prev) => {
      callback(`${src}/${file}`, 'update', `${path}.${file}`.substr(1));
    });
  }
  return files;
};