const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
    socket_id: String,
    status: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
