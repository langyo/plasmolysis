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
    name: String,
    sex: {
      type: String,
      enum: ["boy", "girl"]
    },
    reason: String,
    grade: Number,
    classId: Number
  })),
  
  rootAccounts: db.model("RootAccount", mongoose.Schema({
    name: String,
    password: String
  })),

  classInfo: db.model("ClassInfo", mongoose.Schema({
    grade: Number,
    classId: Number,
    classMaster: String
  }))
}