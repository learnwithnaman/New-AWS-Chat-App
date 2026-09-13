// In-memory state (no DB, same "stateless-server" spirit as the original app).
// Resets whenever the pod restarts — good enough for a demo, documented in README.
const MAX_HISTORY = 100;

const messageHistory = [];
const onlineUsers = new Map(); // socket.id -> username

const trim = (str, max) => (str || "").toString().trim().slice(0, max);

const pushMessage = (msg) => {
  messageHistory.push(msg);
  if (messageHistory.length > MAX_HISTORY) {
    messageHistory.shift();
  }
};

const broadcastUserList = (io) => {
  io.emit("users-list", Array.from(onlineUsers.values()));
};

const registerChatHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("join", (rawUsername) => {
      const username = trim(rawUsername, 24) || `Guest-${socket.id.slice(0, 4)}`;
      socket.data.username = username;
      onlineUsers.set(socket.id, username);

      // Send existing history only to the joining client
      socket.emit("chat-history", messageHistory);

      const systemMsg = {
        id: `${Date.now()}-${socket.id}`,
        type: "system",
        text: `${username} joined the chat`,
        timestamp: Date.now()
      };
      pushMessage(systemMsg);
      io.emit("chat-message", systemMsg);
      broadcastUserList(io);
    });

    socket.on("chat-message", (rawText) => {
      const username = socket.data.username;
      const text = trim(rawText, 500);
      if (!username || !text) return;

      const msg = {
        id: `${Date.now()}-${socket.id}`,
        type: "message",
        username,
        text,
        timestamp: Date.now()
      };
      pushMessage(msg);
      io.emit("chat-message", msg);
    });

    socket.on("typing", (isTyping) => {
      const username = socket.data.username;
      if (!username) return;
      socket.broadcast.emit("typing", { username, isTyping: !!isTyping });
    });

    socket.on("disconnect", () => {
      const username = onlineUsers.get(socket.id);
      onlineUsers.delete(socket.id);

      if (username) {
        const systemMsg = {
          id: `${Date.now()}-${socket.id}`,
          type: "system",
          text: `${username} left the chat`,
          timestamp: Date.now()
        };
        pushMessage(systemMsg);
        io.emit("chat-message", systemMsg);
        broadcastUserList(io);
      }
    });
  });
};

module.exports = { registerChatHandlers };
