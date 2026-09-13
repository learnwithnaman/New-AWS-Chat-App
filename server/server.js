const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const { registerChatHandlers } = require("./sockets/chatSocket");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow all origins (important for browser requests)
app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/chatRoutes"));

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Socket.IO needs the raw http server (not just the express app)
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

registerChatHandlers(io);

server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});
