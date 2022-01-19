require('dotenv').config();
const { server } = require("./socket");
require("./database");

server.listen(4000, () => {
  console.log("listening on port 4000");
});