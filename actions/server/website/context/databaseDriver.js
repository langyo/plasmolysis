const mongoose = require('mongoose');

let db = mongoose.createConnection('mongodb://localhost/test');

db.on('error', e => (console.error(e), process.exit()));

db.once('open', () => {
  console.log('Database has been connected.');
});

export default {
  notes: db.model("Notes", mongoose.Schema({
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    author: String,
    title: String,
    body: String
  })),
  
  accounts: db.model("Account", mongoose.Schema({
    name: String,
    password: String,
    token: {
      type: String,
      default: ''
    }
  }))
}