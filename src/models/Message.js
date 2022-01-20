const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    username: String,
    message: String,
    date: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Message", messageSchema);
