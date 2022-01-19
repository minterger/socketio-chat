const socket = io();

// Username login storange
let username = localStorage.getItem("username");

// dom elements
const login = document.getElementById("login");
const logout = document.getElementById("logout");
const user = document.getElementById("user");
const users = document.getElementById("users");
const connected = document.getElementById("connected");
const chat = document.getElementById("chat-messages");
const inputForm = document.getElementById("input-chat");

// if username is not set
if (!username) {
  user.classList.add("hidden");
  connected.classList.add("hidden");
  login.classList.remove("hidden");
  chat.classList.add("opacity-0");
} else {
  user.querySelector("strong").textContent = username;
  socket.emit("user-connected", username);
}

// login event listener
login.addEventListener("submit", (e) => {
  e.preventDefault();
  username = login.querySelector("input").value;
  login.classList.add("hidden");
  user.classList.remove("hidden");
  connected.classList.remove("hidden");
  chat.classList.remove("opacity-0");
  user.querySelector("strong").textContent = username;
  localStorage.setItem("username", username);
  socket.emit("user-connected", username);
});

// logout event listener
logout.addEventListener("click", (e) => {
  e.preventDefault();
  username = "";
  login.classList.remove("hidden");
  user.classList.add("hidden");
  connected.classList.add("hidden");
  chat.classList.add("opacity-0");
  localStorage.removeItem("username");
  socket.emit("user-disconnect", username);
});

// socket event listeners
socket.on("chat", (data) => {
  chat.innerHTML += `<div class="flex bg-slate-500 p-2 rounded-lg text-white justify-between mb-2">
    <div class="flex-1">
      <p class="text-md mb-1">${data.username}</p>
      <p class="text-sm">${data.message}</p>
    </div>
    <div class="w-10 text-right">
      <p class="text-sm">${data.date}</p>
    </div>
  </div>`;

  // scroll to bottom
  chat.scrollTop = chat.scrollHeight;
});

socket.on("previousMessages", (messages) => {
  chat.innerHTML = "";
  messages.forEach((message) => {
    chat.innerHTML += `<div class="flex bg-slate-500 p-2 rounded-lg text-white justify-between mb-2">
        <div class="flex-1">
          <p class="text-md mb-1">${message.username}</p>
          <p class="text-sm">${message.message}</p>
        </div>
        <div class="w-10 text-right">
          <p class="text-sm">${message.date}</p>
          </div>
      </div>`;
  });
  // scroll to bottom
  chat.scrollTop = chat.scrollHeight;
});

socket.on("connected-users", (usersOnline) => {
  users.innerHTML = "";
  usersOnline.forEach((user) => {
    users.innerHTML += `
      <li id="${user.id}" class="flex justify-between pt-2">
        <span class="leading-loose">User: <strong>${user.username}</strong></span>
        <span class="leading-loose">Connected</span>
      </li>`;
  });
});

// inputForm event listener
inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = inputForm.querySelector("input");
  const msgTtim = message.value.trim();
  const date = new Date();
  const time = {
    hours: date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
    minutes: date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
  }

  // send message to server if message is not empty and username is set
  if (msgTtim && username) {
    socket.emit("chat", {
      message: msgTtim,
      username,
      date: `${time.hours}:${time.minutes}`,
    });
    message.value = "";
  }
});
