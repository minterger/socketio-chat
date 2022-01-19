const express = require("express");
const path = require("path");
const app = express();
const User = require("./models/User");

// (async () => {
//   try {
//     const users = await User.find({ status: "online" });
//     users.forEach((user) => {
//       user.status = "offline";
//       user.save();
//     });
//     console.log("disconnected all users");
//   } catch (error) {
//     console.log(error);
//   }
// })();

app.set("port", process.env.PORT || 4000);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/view/index.html"));
});

app.use(express.static(path.join(__dirname + "/public")));

module.exports = app;
