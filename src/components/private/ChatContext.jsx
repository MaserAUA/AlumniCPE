// ChatContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
// import { wsService } from './websocketService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Map());

  useEffect(() => {
    // สมมติว่าเรามี userId จาก authentication
    const userId = 'current-user-id';
    // wsService.connect(userId);

    // const unsubscribe = wsService.subscribe((data) => {
    //   switch (data.type) {
    //     case 'message':
    //       handleNewMessage(data);
    //       break;
    //     case 'typing':
    //       handleTypingStatus(data);
    //       break;
    //     case 'status':
    //       handleOnlineStatus(data);
    //       break;
    //   }
    // });

    return () => {
      // unsubscribe();
      // wsService.disconnect();
    };
  }, []);

  const handleNewMessage = (data) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      title: 'New Message',
      message: data.text,
      sender: data.sender,
      timestamp: new Date()
    }]);
  };

  const handleTypingStatus = (data) => {
    setTypingUsers(prev => {
      const newMap = new Map(prev);
      if (data.isTyping) {
        newMap.set(data.userId, Date.now());
      } else {
        newMap.delete(data.userId);
      }
      return newMap;
    });
  };

  const handleOnlineStatus = (data) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      if (data.isOnline) {
        newSet.add(data.userId);
      } else {
        newSet.delete(data.userId);
      }
      return newSet;
    });
  };

  const sendMessage = (message) => {
    // wsService.sendMessage(message);
  };

  const sendTypingStatus = (receiverId, isTyping) => {
    // wsService.sendTypingStatus(receiverId, isTyping);
  };

  return (
    <ChatContext.Provider 
      value={{
        notifications,
        onlineUsers,
        typingUsers,
        sendMessage,
        sendTypingStatus
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};