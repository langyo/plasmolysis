import React from 'react';

const requireFunc = require.context('./', true, /(\.jsx)|(\.tsx)|(\.json)|(\.js)|(\.mjs)|(\.ts)/);
let ret = {};

requireFunc.keys().forEach(key => {
  if (key === './index.js') return;
  let path = /^\.\/(.*)\.js$/.exec(key)[1].split('/');
  const dfs = obj => {
    let head = path.shift();
    if (path.length > 0) {
      if (obj[head]) obj[head] = dfs(obj[head]);
      else obj[head] = dfs({});
    } else {
      obj[head] = requireFunc(key).default;
    }
    return obj;
  }
  ret = dfs(ret);
});

export default ret;