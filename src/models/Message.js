const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  username: String,
  message: String,
  date: String
});

module.exports = model('Message', messageSchema);