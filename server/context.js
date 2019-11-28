const mongoose = require('mongoose');

let db = mongoose.createConnection('mongodb://localhost/i-note');

db.on('error', e => (console.error(e), process.exit()));

db.once('open', () => {
  console.log('Database has been connected.');
});

module.exports = {
  db: {
    logger: db.model("Log", mongoose.Schema({
      date: {
        type: Date,
        index: true
      },
      name: String,
      sex: {
        type: String,
        enum: ["boy", "girl"]
      },
      reason: String,
      grade: Number,
      classId: Number
    })),

    accounts: db.model("Account", mongoose.Schema({
      name: String,
      password: String
    })),

    notes: db.model("Note", mongoose.Schema({
      owner: {
        type: String,
        index: true
      },
      title: String,
      body: String,
      date: {
        type: Date,
        index: true
      }
    }))
  }
}