const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: String,
  socket_id: String,
  status: String,
  date: { type: Date, default: Date.now }
});

module.exports = model('User', userSchema);