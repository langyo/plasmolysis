const mongoose = require('mongoose');

let db = mongoose.createConnection('mongodb://localhost/i-note');

db.on('error', e => (console.error(e), process.exit()));

db.once('open', () => {
  console.log('Database has been connected.');
});

const ObjectId = mongoose.Schema.Types.ObjectId;

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
      },
      tags: [{
        type: ObjectId  
      }]
    })),

    tags: db.model("Tag", mongoose.Schema({
      // 这玩意相当于文件夹，可以包含其它标签或笔记
      name: String,
      fullPath: {
        type: String,
        index: true
      },
      tags: [{
        type: ObjectId
      }],
      notes: [{
        type: ObjectId
      }]
    }))
  }
}