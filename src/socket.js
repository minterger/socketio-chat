const { Server } = require("socket.io");
const app = require("./app");
const http = require("http");
const User = require("./models/User");
const Message = require("./models/Message");

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("made socket connection", socket.id);

  const username = socket.handshake.headers.username;
  if (username) {
    console.log("connected user", username);
    const findUser = await User.findOneAndUpdate(
      { username },
      { socket_id: socket.id, status: "online" }
    );
    if (!findUser) {
      const user = new User({
        username,
        socket_id: socket.id,
        status: "online",
      });
      await user.save();
    }

    const usersOnline = await User.find({ status: "online" });
    socket.emit("connected-users", usersOnline);
    socket.broadcast.emit("connected-users", usersOnline);
  }

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

  socket.on("user-connected", async (username) => {
    console.log("connected user", username);
    const findUser = await User.findOne({ username });
    if (!findUser) {
      const user = new User({
        username,
        socket_id: socket.id,
        status: "online",
      });
      await user.save();
    } else {
      findUser.status = "online";
      findUser.socket_id = socket.id;
      await findUser.save();
    }

    const usersOnline = await User.find({ status: "online" });
    socket.emit("connected-users", usersOnline);
    socket.broadcast.emit("connected-users", usersOnline);
  });

  socket.on("user-disconnect", async () => {
    const findUser = await User.findOneAndUpdate(
      { socket_id: socket.id },
      { status: "offline" }
    );
    if (findUser) {
      console.log("user disconnected", findUser.username);
    }

    const usersOnline = await User.find({ status: "online" });
    socket.emit("connected-users", usersOnline);
    socket.broadcast.emit("connected-users", usersOnline);
  });

  socket.on("disconnect", async () => {
    const findUser = await User.findOneAndUpdate(
      { socket_id: socket.id },
      { status: "offline" }
    );
    if (findUser) {
      console.log("disconnected", findUser.username);
    }

    const usersOnline = await User.find({ status: "online" });
    socket.emit("connected-users", usersOnline);
    socket.broadcast.emit("connected-users", usersOnline);
  });
});

module.exports = { server };
