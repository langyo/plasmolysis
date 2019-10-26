const logger = require('./databaseDriver');

module.exports = server => {
  server.use('/api/getLatestList', (req, res) => {
    console.log("getLatestList has been fetched.");

    logger.find().sort({ date: -1 }).limit(10).exec((err, doc) => {
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
    console.log("submit has been fetched, ", req.body);

    let state = 'success';
    for(let i of req.body.list) {
      let item = new logger({
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
  })
};