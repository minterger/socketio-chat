const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");
const User = require("./models/User");

(async () => {
  try {
    await User.updateMany({status: 'online'}, {$set: {status: 'offline'}});
    console.log("disconnected all users");
  } catch (error) {
    console.log(error);
  }
})();

app.set("port", process.env.PORT || 4000);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/view/index.html"));
});

app.use(express.static(path.join(__dirname + "/public")));

module.exports = app;
