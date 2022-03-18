const Message = require("./models/Message");

const initSocks = (io) => {
  io.use((socket, next) => {
    const { username } = socket.handshake.auth;

    if (!username) return next(new Error("invalid username"));

    for (let [id, socket] of io.of("/").sockets) {
      if (username === socket.username)
        return next(new Error("invalid username"));
    }

    socket.username = username;
    next();
  });

  io.on("connection", async (socket) => {
    console.log("made socket connection", socket.username, socket.id);

    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        id,
        username: socket.username,
      });
    }

    socket.emit("connected-users", users);
    socket.broadcast.emit("connected-users", users);

    const messages = await Message.find().sort({ createdAt: 1 }).limit(10);
    socket.emit("previousMessages", messages);

    socket.on("chat", async (data) => {
      socket.emit("chat", data);
      socket.broadcast.emit("chat", data);
      const message = new Message({
        username: data.username,
        message: data.message,
        date: data.date,
      });
      await message.save();
    });

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      const users = [];
      for (let [id, socket] of io.of("/").sockets) {
        users.push({
          id,
          username: socket.username,
        });
      }
      socket.broadcast.emit("connected-users", users);
    });
  });
};

module.exports = { initSocks };
