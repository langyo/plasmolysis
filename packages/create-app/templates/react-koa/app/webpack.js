import webpack from 'webpack';

webpack({
  
}, (err, status) => {
  if(err || status.hasErrors()) throw new Error(err || status.hasErrors());

  const now = (new Date()).toLocaleTimeString();
  console.log(`[${now}] Webpack has been compiled the static file.`);
});
