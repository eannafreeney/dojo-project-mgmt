// hooks
import { useCollection } from "../../hooks/useCollection";

// styles
import "./online-users.css";

// components
import Avatar from "../Avatar/Avatar";

export default function OnlineUsers() {
  const { error, documents } = useCollection("users");

  return (
    <div className="user-list">
      <div className="user-list-content">
        <h2>All Users</h2>
        {error && <div className="error">{error}</div>}
        {documents &&
          documents.map((user) => {
            return (
              <div key={user.id} className="user-list-item">
                {user.online && <span className="online-user"></span>}
                <span>{user.displayName}</span>
                <Avatar src={user.photoURL} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
