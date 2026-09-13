import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import JoinScreen from "./JoinScreen";
import MessageList from "./MessageList";
import UserList from "./UserList";

// ✅ Dynamic socket URL (same pattern as old API_URL — no hardcoded host,
// works behind the ALB/Ingress "/" + "/socket.io" routing)
const SOCKET_URL = window.location.origin;

const Chat = () => {
  const [username, setUsername] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [input, setInput] = useState("");

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!username) return;

    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join", username);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("chat-history", (history) => setMessages(history));

    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("users-list", (list) => setUsers(list));

    socket.on("typing", ({ username: typer, isTyping }) => {
      setTypingUser(isTyping ? typer : null);
    });

    return () => socket.disconnect();
  }, [username]);

  const sendMessage = useCallback(
    (e) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || !socketRef.current) return;
      socketRef.current.emit("chat-message", text);
      socketRef.current.emit("typing", false);
      setInput("");
    },
    [input]
  );

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socketRef.current) return;
    socketRef.current.emit("typing", true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("typing", false);
    }, 1500);
  };

  if (!username) {
    return <JoinScreen onJoin={setUsername} />;
  }

  return (
    <div className="chat-container">
      <div className="chat-main">
        <div className="chat-header">
          <h1 className="app-title">💬 ChatRoom</h1>
          <span className={`connection-badge ${connected ? "online" : "offline"}`}>
            {connected ? "Connected" : "Reconnecting..."}
          </span>
        </div>

        <MessageList messages={messages} currentUser={username} />

        <div className="typing-indicator">
          {typingUser ? `${typingUser} is typing...` : "\u00A0"}
        </div>

        <form className="message-form" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            maxLength={500}
            autoFocus
          />
          <button type="submit" disabled={!input.trim()}>
            Send
          </button>
        </form>
      </div>

      <UserList users={users} currentUser={username} />
    </div>
  );
};

export default Chat;
