import React, { RefObject } from "react";

type Notification = {
  content: string;
  message_id: string;
  sender_id: string;
  sender_username: string;
  timestamp: number;
  read?: boolean;
};

type Props = {
  notifications: Notification[];
  onClose: () => void;
  reference: RefObject<HTMLDivElement>
};

export default function NotificationDropdown({ notifications, onClose, reference }: Props) {
  return (
    <div ref={reference} className="fixed top-24 right-5 w-80 max-h-[400px] overflow-y-auto bg-white shadow-lg rounded-lg z-50 p-4 animate-fade-in">
      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <h4 className="text-lg font-semibold">Notifications</h4>
        <button
          className="text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-400">No notifications</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.message_id}
              className={`p-3 rounded-md ${
                n.read
                  ? "bg-gray-50"
                  : "bg-blue-50 border-l-4 border-blue-500 font-medium"
              }`}
            >
              <div className="text-sm">{n.content}</div>
              <div className="text-xs text-gray-500 flex justify-between mt-1">
                <span>{n.sender_username}</span>
                <span>{new Date(n.timestamp).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
