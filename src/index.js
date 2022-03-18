require("dotenv").config();
const { app, server } = require("./app");
require("./database");

server.listen(app.get("port"), () => {
  console.log("listening on port", app.get("port"));
});
