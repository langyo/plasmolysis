const fs = require('fs');
const child_process = require('child_process');

try {
  fs.mkdirSync('./node_modules');
} catch (e) { }
try {
  fs.mkdirSync('./node_modules/neon');
} catch (e) { }
try {
  fs.mkdirSync('./node_modules/neon/src');
} catch (e) { }

function copyFile(src, target) {
  console.log(`Copying ${src} to ${target}`);
  fs.writeFileSync(target, fs.readFileSync(src));
}

function copyDir(src, target) {
  if(!fs.existsSync(target)) fs.mkdirSync(target);
  let files = fs.readdirSync(src);
  for (let file of files) {
    if(fs.statSync(`${src}/${file}`).isDirectory()) copyDir(`${src}/${file}`, `${target}/${file}`);
    else copyFile(`${src}/${file}`, `${target}/${file}`);
  }
}

// 自动复制一次文件
copyDir('../src', './node_modules/neon/src', function (err) {
  if (err) throw err;
});
copyFile('../package.json', './node_modules/neon/package.json');
copyFile('../.babelrc', './node_modules/neon/.babelrc');
console.log('The core library has been copied to the modules\' folder.')

// 安装依赖
try {
  console.log('Installing dependies...Please wait for a while...');
  child_process.execSync('yarn', { cwd: `${__dirname}\\node_modules\\neon` });
} catch (e) {
  child_process.execSync('npm install', { cwd: `${__dirname}\\node_modules\\neon` });
}
console.log('The core library\'s dependies has been installed.')

// 创建监听
function watchDir(src, target) {
  let files = fs.readdirSync(src);
  for (let file of files) {
    if (fs.statSync(`${src}/${file}`).isDirectory()) watchDir(`${src}/${file}`, `${target}/${file}`);
    else fs.watchFile(`${src}/${file}`, (cur, prev) => {
      copyFile(`${src}/${file}`, `${target}/${file}`);
      console.log('Updated', `${src}/${file}`, 'to', `${target}/${file}`);
    });
  }
}
watchDir('../src', './node_modules/neon/src')
console.log('The watchers has been created.');
