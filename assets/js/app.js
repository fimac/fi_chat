// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html";
// We are importing socket and presence javascript that comes with Phoenix.
import { Socket, Presence } from "phoenix";
// In the index.html.eex file we had a span with an id of User. This is where we grab that name
// and pass it to a new Socket connection
let user = document.getElementById("User").innerText;
let socket = new Socket("/socket", { params: { user: user } });
// And then connect.
socket.connect();

// initialize an object named presences
let presences = {};
// formatTimestamp turns our server generated timestamp into a human readable format.
let formatTimestamp = timestamp => {
  let date = new Date(timestamp);
  return date.toLocaleTimeString();
};
// Presence.list - a given user can have multiple presences (Phoenix sends as metas)
// For example they might be online from a browser as well as a mobile device.
// listBy function, returns a JavaScript object witht he users name and when they were first detected online.
let listBy = (user, { metas: metas }) => {
  return {
    user: user,
    onlineAt: formatTimestamp(metas[0].online_at)
  };
};

// The render function updates our list of users to display all online users. We call this whenever a user joins or
// leaves a room.
let userList = document.getElementById("UserList");
let render = presences => {
  userList.innerHTML = Presence.list(presences, listBy)
    .map(
      presence => `
      <li>
        ${presence.user}
        <br>
        <small>online since ${presence.onlineAt}</small>
      </li>
    `
    )
    .join("");
};

// Channels

// Telling javascript that there is a channel called room:lobby and to join it.
// We need to handle two events as far as Presence is concerned.
// In both cases Phoniex's Presence Javascript has the functions to do the heavy
// lifting for us.

// "presence_state" => when the server sends us the state of everyone online
// which happens when we first connect and if we ever disconnect.
// Javascript function => syncState.

// "presence_diff" => the server will send when someone joins or leaves and contains just the
// difference we need to adjust for.
// Javascript function => syncDiff

// syncState & syncDiff will set out presences object to the current state of who's online, which
// we then render as HTML for display.

let room = socket.channel("room:lobby");
room.on("presence_state", state => {
  presences = Presence.syncState(presences, state);
  render(presences);
});

room.on("presence_diff", diff => {
  presences = Presence.syncDiff(presences, diff);
  render(presences);
});

room.join();

// // Here we are wiring up the input which has an id of NewMessage, to list for Enter (keyCode 13)
// // and use room.push() to send whatever the users typed to the server.
let messageInput = document.getElementById("NewMessage");
messageInput.addEventListener("keypress", e => {
  if (e.keyCode == 13 && messageInput.value != "") {
    room.push("message:new", messageInput.value);
    messageInput.value = "";
  }
});

// When the server receives a message from any user, including the current one, the server will
// send it back out with the users name and message timestamp as metadata, over the socket as
// a "message:new" event.
// We'll listen out for these messages on the client-side and when one is received, a list is built
// with the message data, and it gets appende to the message list.

let messageList = document.getElementById("MessageList");
let renderMessage = message => {
  let messageElement = document.createElement("li");
  messageElement.innerHTML = `
  <b>${message.user}</b>
  <i>${formatTimestamp(message.timestamp)}</i>
  <p>${message.body}</p>`;

  // Finally messageList.scrollTop is set to its max value to ensure that new messages are always displayed
  // pushing older messages up out of immediate view.
  messageList.appendChild(messageElement);
  messageList.scrollTop = messageList.scrollHeight;
};

room.on("message:new", message => renderMessage(message));

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"
