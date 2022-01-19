require("dotenv").config();
const { server } = require("./socket");
require("./database");

server.listen(app.get("port"), () => {
  console.log("listening on port", app.get("port"));
});
