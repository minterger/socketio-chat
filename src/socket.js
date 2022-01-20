const { Server } = require("socket.io");
const app = require("./app");
const http = require("http");
const User = require("./models/User");
const Message = require("./models/Message");

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("made socket connection", socket.id);

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
    const findUser = await User.findOne({ username });
    console.log("connected user", username);
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
    const findUser = await User.findOne({ socket_id: socket.id });
    if (findUser) {
      console.log("user disconnected", findUser.username);
      findUser.status = "offline";
      await findUser.save();
    }

    const usersOnline = await User.find({ status: "online" });
    socket.emit("connected-users", usersOnline);
    socket.broadcast.emit("connected-users", usersOnline);
  });

  socket.on("disconnect", async () => {
    const findUser = await User.findOne({ socket_id: socket.id });
    if (findUser) {
      console.log("disconnected", findUser.username);
      findUser.status = "offline";
      await findUser.save();
    }

    const usersOnline = await User.find({ status: "online" });
    socket.emit("connected-users", usersOnline);
    socket.broadcast.emit("connected-users", usersOnline);
  });
});

module.exports = { server };
