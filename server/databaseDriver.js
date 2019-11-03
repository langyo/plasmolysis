const mongoose = require('mongoose');

let db = mongoose.createConnection('mongodb://localhost/morning_check');

db.on('error', e => (console.error(e), process.exit()));

db.once('open', () => {
  console.log('Database has been connected.');
});

module.exports = {
  logger: db.model("Log", mongoose.Schema({
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    info: String
  })),
  
  accounts: db.model("Account", mongoose.Schema({
    name: String,
    password: String
  }))
}