const models = require('./databaseDriver');

models.accounts.find({ name: 'admin' }).exec(doc => {
  if (!doc) {
    let n = new models.accounts({
      name: 'admin',
      password: 'admin'
    });
    n.save();
  }
})

module.exports = server => {
  server.use('/api/getLog', (req, res) => {
    models.log.find().sort({ date: -1 }).limit(10).exec((err, doc) => {
      if (err) {
        res.send(JSON.stringify({ state: 'fail' }));
        res.end();
        return;
      }

      res.send(JSON.stringify({
        state: 'success',
        list: doc
      }));
      res.end();
    })
  });

  server.use('/api/submit', (req, res) => {
    (new models.log({
      info: req.body.info
    })).save(err => {
      if (err) {
        res.send(JSON.stringify({ state: 'fail' }));
        res.end();
        return;
      }
      
      res.send(JSON.stringify({ state: 'success' }));
      res.end();
    });
  });
};