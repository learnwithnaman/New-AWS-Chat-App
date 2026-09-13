import React, { useState } from "react";

const JoinScreen = ({ onJoin }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onJoin(trimmed);
  };

  return (
    <div className="join-screen">
      <h1 className="app-title">💬 ChatRoom</h1>
      <p className="join-subtitle">Pick a username to join the live chat</p>
      <form onSubmit={handleSubmit} className="join-form">
        <input
          type="text"
          value={name}
          maxLength={24}
          placeholder="Your name..."
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <button type="submit" disabled={!name.trim()}>
          Join Chat
        </button>
      </form>
    </div>
  );
};

export default JoinScreen;
