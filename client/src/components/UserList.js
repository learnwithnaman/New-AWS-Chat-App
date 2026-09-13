import React from "react";

const UserList = ({ users, currentUser }) => {
  return (
    <div className="user-list">
      <div className="user-list-header">
        Online <span className="user-count">{users.length}</span>
      </div>
      <ul>
        {users.map((u) => (
          <li key={u} className={u === currentUser ? "self" : ""}>
            <span className="status-dot" />
            {u} {u === currentUser && "(you)"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
