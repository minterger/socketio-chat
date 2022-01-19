require("dotenv").config();
const { server } = require("./socket");
const app = require("./app");
require("./database");

server.listen(app.get("port"), () => {
  console.log("listening on port", app.get("port"));
});
