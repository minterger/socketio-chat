const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const { initSocks } = require("./socket");
const morgan = require("morgan");

const server = http.createServer(app);
const io = new Server(server);

initSocks(io);

app.set("port", process.env.PORT || 4000);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/view/index.html"));
});

app.use(express.static(path.join(__dirname + "/public")));

module.exports = { app, server };
