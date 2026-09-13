import React from "react";

const formatTime = (timestamp) => {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MessageBubble = ({ message, isOwn }) => {
  if (message.type === "system") {
    return <div className="system-message">{message.text}</div>;
  }

  return (
    <div className={`message-row ${isOwn ? "own" : ""}`}>
      <div className="message-bubble">
        {!isOwn && <div className="message-sender">{message.username}</div>}
        <div className="message-text">{message.text}</div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
