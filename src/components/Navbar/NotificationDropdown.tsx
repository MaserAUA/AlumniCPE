import React from 'react';

export default function NotificationDropdown({ notifications, onClose }) {
  const unread = notifications.filter(n => !n.read);

  return (
    <div className="dropdown">
      <button onClick={onClose}>✖ Close</button>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map(n => (
            <li key={n.id} className={n.read ? "" : "unread"}>
              {n.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
