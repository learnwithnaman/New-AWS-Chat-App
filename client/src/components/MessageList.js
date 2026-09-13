import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, currentUser }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.length === 0 && (
        <div className="empty-state">No messages yet — say hi 👋</div>
      )}
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.username === currentUser}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
