const models = require('./databaseDriver');

models.rootAccounts.find({name: 'admin'}).exec(doc => {
  if(!doc) {
    let n = new models.rootAccounts({
      name: 'admin',
      password: 'admin'
    });
    n.save();
  }
})

module.exports = server => {
  server.use('/api/getLatestList', (req, res) => {
    models.logger.find().sort({ date: -1 }).limit(10).exec((err, doc) => {
      if(err) {
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
    let state = 'success';
    for(let i of req.body.list) {
      let item = new models.logger({
        name: i.name,
        sex: i.sex,
        reason: i.reason,
        grade: req.body.grade,
        classId: req.body.classId
      });

      item.save(err => {
        if(err) state = 'error';
      });
    }

    res.send(JSON.stringify({ state }));
    res.end();
  });

  server.use('/api/getClassList', (req, res) => {
    models.logger.find().sort({ grade: 1 }).sort({ classId: 1 }).exec((err, doc) => {
      if(err) {
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

  server.use('/api/loginRootAccount', (req, res) => {
    models.rootAccounts.findOne({ name: req.body.name }).exec((err, doc) => {
      if(err || doc.password !== req.body.password) {
        res.send(JSON.stringify({ state: 'fail' }));
        res.end();
        return;
      }

      res.send(JSON.stringify({
        state: 'success'
      }));
      res.end();
    });
  });
};