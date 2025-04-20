// ChatPage.js
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  IoSend, 
  IoEllipsisVertical,
  IoSearch,
  IoImage,
  IoHappy,
  IoChevronBack,
  IoClose,
  IoTrash,
  IoArrowBack,
  IoNotifications,
  IoPersonAdd, // เพิ่มไอคอนสำหรับเพิ่มเพื่อน
  IoPeople // เพิ่มไอคอนสำหรับแสดงรายชื่อผู้ใช้
} from "react-icons/io5";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useChat } from './ChatContext';
import { wsService } from './websocketService';

// Utility functions
const moveContactToTop = (contacts, contact) => {
  const uniqueContacts = Array.from(
    new Map(contacts.map(item => [item.email, item])).values()
  );
  const filtered = uniqueContacts.filter((c) => c.email !== contact.email);
  return [contact, ...filtered];
};

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return format(date, "HH:mm");
  } else if (
    date.getDate() === now.getDate() - 1 &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return "Yesterday";
  } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return format(date, "EEEE");
  } else {
    return format(date, "dd/MM/yyyy");
  }
};

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedContact = location.state?.contact;
  
  // Chat Context
  const { 
    notifications,
    onlineUsers, 
    typingUsers,
    sendMessage: wsSendMessage,
    sendTypingStatus 
  } = useChat();

  // State variables
  const [chatContacts, setChatContacts] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(new Map());
  
  // Add Friend Modal state variables
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load contacts from localStorage on mount
  useEffect(() => {
    const storedContacts = localStorage.getItem("chat_contacts");
    if (storedContacts) {
      setChatContacts(JSON.parse(storedContacts));
    }
  }, []);

  // Save contacts to localStorage when updated
  useEffect(() => {
    if (chatContacts.length > 0) {
      localStorage.setItem("chat_contacts", JSON.stringify(chatContacts));
    }
  }, [chatContacts]);

  // Handle passed contact from Card view
  useEffect(() => {
    if (passedContact?.email) {
      const existingContact = chatContacts.find(c => c.email === passedContact.email);
      
      if (existingContact) {
        setChatContacts(prev => moveContactToTop(prev, existingContact));
        setSelectedContact(existingContact);
      } else {
        const newContact = {
          ...passedContact,
          lastMessage: "",
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0
        };
        setChatContacts(prev => [newContact, ...prev]);
        setSelectedContact(newContact);
      }
      
      if (isMobileView) {
        setShowChatOnMobile(true);
      }
    }
  }, [passedContact, isMobileView]);

  // Mobile view detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // WebSocket message handler
  useEffect(() => {
    const handleWebSocketMessage = (data) => {
      if (data.type === 'message') {
        const { sender, receiver, text, timestamp, type: msgType, content } = data;
        const messageEmail = sender.email;

        setMessages(prev => ({
          ...prev,
          [messageEmail]: [
            ...(prev[messageEmail] || []),
            { sender: sender.firstName, text, timestamp, type: msgType, content }
          ]
        }));

        setChatContacts(prev => {
          const contact = prev.find(c => c.email === messageEmail);
          if (contact) {
            const updatedContact = {
              ...contact,
              lastMessage: text || '📷 Image',
              lastMessageTime: timestamp,
              unreadCount: selectedContact?.email === messageEmail ? 0 : (contact.unreadCount || 0) + 1
            };
            return moveContactToTop(prev, updatedContact);
          }
          return prev;
        });

        if (selectedContact?.email === messageEmail) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const unsubscribe = wsService.subscribe(handleWebSocketMessage);
    return () => unsubscribe();
  }, [selectedContact]);

  // Load messages when selecting contact
  useEffect(() => {
    if (selectedContact?.email) {
      const loaded = loadMessagesFromLocalStorage(selectedContact.email);
      setMessages(prev => ({
        ...prev,
        [selectedContact.email]: loaded
      }));
      
      setCurrentMessage("");
      setImagePreview(null);
      
      if (inputRef.current) {
        inputRef.current.focus();
      }

      setChatContacts(prev => 
        prev.map(c => 
          c.email === selectedContact.email ? { ...c, unreadCount: 0 } : c
        )
      );
    }
  }, [selectedContact]);

  // Typing status handler
  useEffect(() => {
    let typingTimer;
    if (currentMessage.length > 0 && selectedContact) {
      sendTypingStatus(selectedContact.email, true);
      clearTimeout(typingTimer);  
      typingTimer = setTimeout(() => {
        sendTypingStatus(selectedContact.email, false);
      }, 1000);
    }

    return () => clearTimeout(typingTimer);
  }, [currentMessage, selectedContact, sendTypingStatus]);

  // Local Storage functions
  const loadMessagesFromLocalStorage = (email) => {
    if (!email) return [];
    const stored = localStorage.getItem(`chat_${email}`);
    return stored ? JSON.parse(stored) : [];
  };

  const saveMessagesToLocalStorage = (email, msgs) => {
    if (!email) return;
    localStorage.setItem(`chat_${email}`, JSON.stringify(msgs));
  };

  // Message functions
  const sendMessage = () => {
    if (!selectedContact?.email) return;
    if (currentMessage.trim() === "" && !imagePreview) return;

    const timestamp = new Date().toISOString();
    const messageData = {
      receiver: selectedContact.email,
      text: currentMessage.trim(),
      timestamp,
      type: imagePreview ? 'image' : 'text',
      content: imagePreview
    };

    wsSendMessage(messageData);

    const newMsg = {
      sender: "You",
      text: messageData.text,
      timestamp,
      type: messageData.type,
      content: messageData.content
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.email]: [
        ...(prev[selectedContact.email] || []),
        newMsg
      ]
    }));

    const lastMessagePreview = imagePreview ? 
      (currentMessage.trim() ? `📷 ${currentMessage.trim()}` : '📷 Image') : 
      currentMessage.trim();

    setChatContacts(prev => {
      const updatedContact = {
        ...selectedContact,
        lastMessage: lastMessagePreview,
        lastMessageTime: timestamp
      };
      return moveContactToTop(prev, updatedContact);
    });

    setCurrentMessage("");
    setImagePreview(null);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setCurrentMessage(prev => prev + emoji.native);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  const deleteContact = () => {
    if (!selectedContact) return;
    
    setChatContacts(prev => prev.filter(c => c.email !== selectedContact.email));
    localStorage.removeItem(`chat_${selectedContact.email}`);
    setMessages(prev => {
      const newMessages = {...prev};
      delete newMessages[selectedContact.email];
      return newMessages;
    });
    
    setSelectedContact(null);
    setShowDeleteMenu(false);
    
    if (isMobileView) {
      setShowChatOnMobile(false);
    }
  };
  
  // Add Friend Modal functions
  const fetchAllUsers = () => {
    setIsLoadingUsers(true);
    
    // สมมติว่าเราใช้ข้อมูลจาก localStorage ที่บันทึกโดย SharedDataService ในหน้า Table
    setTimeout(() => {
      const tableData = JSON.parse(localStorage.getItem("table_data") || "[]");
      // ถ้าไม่มีข้อมูลใน localStorage ให้ใช้ข้อมูลตัวอย่าง
      if (tableData.length === 0) {
        const sampleUsers = [
          {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            studentID: "64070501001"
          },
          {
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            avatar: "https://randomuser.me/api/portraits/women/2.jpg",
            studentID: "64070501002"
          },
          {
            firstName: "Alice",
            lastName: "Williams",
            email: "alice.williams@example.com",
            avatar: "https://randomuser.me/api/portraits/women/3.jpg",
            studentID: "64070501003"
          },
          {
            firstName: "Bob",
            lastName: "Johnson",
            email: "bob.johnson@example.com",
            avatar: "https://randomuser.me/api/portraits/men/4.jpg",
            studentID: "64070501004"
          },
          {
            firstName: "Charlie",
            lastName: "Brown",
            email: "charlie.brown@example.com",
            avatar: "https://randomuser.me/api/portraits/men/5.jpg",
            studentID: "64070501005"
          }
        ];
        setAllUsers(sampleUsers);
      } else {
        setAllUsers(tableData);
      }
      setIsLoadingUsers(false);
    }, 500);
  };

  const addFriend = (user) => {
    // ตรวจสอบว่าผู้ใช้นี้มีในรายชื่อผู้ติดต่อแล้วหรือไม่
    const existingContact = chatContacts.find(c => c.email === user.email);
    
    if (existingContact) {
      // หากมีแล้ว ให้เลือกผู้ติดต่อนั้น
      setSelectedContact(existingContact);
    } else {
      // หากยังไม่มี ให้สร้างผู้ติดต่อใหม่และเพิ่มเข้าไปในรายชื่อ
      const newContact = {
        firstName: user.firstName || user.name || "Unknown",
        lastName: user.lastName || "",
        email: user.email,
        avatar: user.avatar || "https://via.placeholder.com/150",
        lastMessage: "",
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0
      };
      
      setChatContacts(prev => [newContact, ...prev]);
      setSelectedContact(newContact);
    }
    
    // ปิด modal
    setShowAddFriendModal(false);
  };

  // Helper function for grouping messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages?.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Contacts Sidebar */}
      {(!isMobileView || (isMobileView && !showChatOnMobile)) && (
        <div className={`${isMobileView ? 'w-full' : 'w-1/4'} bg-white border-r border-gray-200 flex flex-col`}>
          {/* Sidebar header */}
          <header className="p-4 border-b border-gray-200 bg-indigo-600 text-white flex flex-col">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Messages</h1>
              <div className="flex space-x-2">
                {/* ปุ่มเพิ่มเพื่อน */}
                <button 
                  onClick={() => {
                    setShowAddFriendModal(true);
                    fetchAllUsers(); // โหลดข้อมูลผู้ใช้เมื่อกดปุ่ม
                  }}
                  className="p-2 rounded-full bg-indigo-700 text-white hover:bg-indigo-800 transition-colors"
                  title="Add New Contact"
                >
                  <IoPersonAdd size={20} />
                </button>
                
                {isMobileView && (
                  <button 
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-indigo-700 text-white hover:bg-indigo-800 transition-colors"
                  >
                    <IoArrowBack size={20} />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-3 relative">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 pl-10 pr-4 rounded-lg bg-indigo-700 bg-opacity-50 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-200" size={20} />
            </div>
          </header>

          {/* Contacts list */}
          <div className="flex-1 overflow-y-auto">
            {chatContacts
              .filter(contact => {
                const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.toLowerCase();
                return fullName.includes(searchQuery.toLowerCase()) || 
                       (contact.email || "").toLowerCase().includes(searchQuery.toLowerCase());
              })
              .map(contact => {
                const isOnline = onlineUsers.has(contact.email);
                const isTyping = typingUsers.has(contact.email);
                
                return (
                  <div
                    key={contact.email}
                    onClick={() => {
                      setSelectedContact(contact);
                      if (isMobileView) {
                        setShowChatOnMobile(true);
                      }
                    }}
                    className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                      selectedContact?.email === contact.email ? "bg-indigo-50" : ""
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={contact.avatar || "https://via.placeholder.com/150"}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-baseline">
                        <h2 className="font-semibold text-gray-800 truncate">
                          {contact.firstName} {contact.lastName}
                        </h2>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                          {contact.lastMessageTime ? formatMessageTime(contact.lastMessageTime) : ""}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {isTyping ? (
                            <span className="text-indigo-600">Typing...</span>
                          ) : (
                            contact.lastMessage || "No messages yet"
                          )}
                        </p>
                        
                        {contact.unreadCount > 0 && (
                          <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Chat Area */}
      {(!isMobileView || (isMobileView && showChatOnMobile)) && (
        <div className={`${isMobileView ? 'w-full' : 'flex-1'} flex flex-col bg-white`}>
          {selectedContact ? (
            <>
              {/* Chat header */}
              <header className="bg-white p-4 text-gray-800 border-b border-gray-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                  {isMobileView && (
                    <button 
                      onClick={() => setShowChatOnMobile(false)}
                      className="mr-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <IoChevronBack className="text-gray-600" size={20} />
                    </button>
                  )}
                  <img
                    src={selectedContact.avatar || "https://via.placeholder.com/150"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div className="ml-3">
                    <h1 className="font-semibold">
                      {selectedContact.firstName} {selectedContact.lastName}
                    </h1>
                    <p className="text-xs">
                      {onlineUsers.has(selectedContact.email) ? (
                        <span className="text-green-500">Online</span>
                      ) : (
                        <span className="text-gray-500">Offline</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center relative">
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                  >
                    <IoEllipsisVertical className="text-gray-600" />
                  </button>
                  
                  {showDeleteMenu && (
                    <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg overflow-hidden z-10 min-w-[150px] border border-gray-200">
                      <button 
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center transition-colors"
                        onClick={deleteContact}
                      >
                        <IoTrash className="mr-2" />
                        Delete Contact
                      </button>
                    </div>
                  )}
                </div>
              </header>

              {/* Chat messages area */}
              <div 
                className="flex-1 overflow-y-auto p-4 bg-gray-50"
                style={{
                  backgroundImage: "url('https://img.freepik.com/free-vector/abstract-minimal-white-background_23-2148887988.jpg?w=826&t=st=1708425161~exp=1708425761~hmac=3fa7c60b6a9dbc6bf4f8c88b5d3c1b0d19905cc87ec7b47be4d5cb6f481bb6d3')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {messages[selectedContact.email]?.length > 0 ? (
                  Object.entries(groupMessagesByDate(messages[selectedContact.email])).map(([date, dateMessages]) => (
                    <div key={date}>
                      {/* Date separator */}
                      <div className="flex justify-center my-4">
                        <div className="bg-gray-200 rounded-full px-4 py-1 text-xs text-gray-600">
                          {date === new Date().toDateString()
                            ? "Today"
                            : date === new Date(Date.now() - 86400000).toDateString()
                            ? "Yesterday"
                            : new Date(date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {/* Messages */}
                      {dateMessages.map((msg, index) => {
                        const isYou = msg.sender === "You";
                        const showAvatar = !isYou && (
                          index === 0 || 
                          dateMessages[index - 1]?.sender === "You"
                        );
                        const time = formatMessageTime(msg.timestamp);
                        
                        return (
                          <div
                            key={index}
                            className={`flex mb-2 ${isYou ? "justify-end" : "justify-start"}`}
                          >
                            {!isYou && showAvatar && (
                              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
                                <img
                                  src={selectedContact.avatar || "https://via.placeholder.com/150"}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            
                            {!isYou && !showAvatar && (
                              <div className="w-8 flex-shrink-0 mr-2"></div>
                            )}
                            
                            <div className="group relative max-w-[70%]">
                              <div
                                className={`p-3 rounded-2xl ${
                                  isYou
                                    ? "bg-indigo-600 text-white ml-2"
                                    : "bg-white text-gray-800 mr-2"
                                }`}
                              >
                                {msg.type === 'image' && (
                                  <div className="mb-2">
                                    <img 
                                      src={msg.content} 
                                      alt="Shared image" 
                                      className="rounded max-w-full"
                                      style={{ maxWidth: "300px" }}
                                    />
                                  </div>
                                )}
                                
                                {msg.text && <p className="break-words">{msg.text}</p>}
                              </div>
                              
                              <div className={`text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                                isYou ? "text-right" : "text-left"
                              } text-gray-500`}>
                                {time}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-center max-w-xs">
                      No messages yet with {selectedContact.firstName}. Say hello to start the conversation!
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
                
                {/* Typing indicator */}
                {typingUsers.has(selectedContact.email) && (
                  <div className="flex items-center space-x-2 p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">{selectedContact.firstName} is typing...</span>
                  </div>
                )}
              </div>

              {/* Image preview */}
              {imagePreview && (
                <div className="bg-gray-50 p-3 border-t border-gray-200">
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-32 rounded-lg border border-gray-300"
                    />
                    <button 
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                    >
                      <IoClose size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Emoji picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-24 left-4 z-10">
                  <Picker 
                    data={data} 
                    onEmojiSelect={handleEmojiSelect}
                    theme="light"
                    previewPosition="none"
                    skinTonePosition="none"
                  />
                </div>
              )}

              {/* Message input */}
              <footer className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center bg-gray-100 rounded-2xl p-1 pr-3">
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2 rounded-full transition-colors duration-150 ${
                      showEmojiPicker 
                        ? "bg-indigo-100 text-indigo-600" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <IoHappy className="h-6 w-6" />
                  </button>
                  
                  <button 
                    onClick={handleImageClick}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
                  >
                    <IoImage className="h-6 w-6" />
                  </button>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 p-2 px-3 bg-transparent outline-none text-gray-800 placeholder-gray-500"
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={currentMessage.trim() === "" && !imagePreview}
                    className={`p-2 rounded-full ${
                      currentMessage.trim() === "" && !imagePreview
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-indigo-600 hover:bg-indigo-100"
                    } transition-colors duration-150`}
                  >
                    <IoSend size={20} />
                  </button>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 p-4">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
              <p className="text-center max-w-xs">
                Select a conversation from the sidebar to start messaging
              </p>
            </div>
          )}
        </div>
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="bg-white shadow-lg rounded-lg p-4 mb-2 max-w-sm animate-slideIn"
          >
            <h4 className="font-semibold">{notification.title}</h4>
            <p className="text-sm text-gray-600">{notification.message}</p>
            <span className="text-xs text-gray-500">
              {notification.sender} • {formatMessageTime(notification.timestamp)}
            </span>
          </div>
        ))}
      </div>

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Add New Contact</h2>
              <button 
                onClick={() => setShowAddFriendModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value.toLowerCase())}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              
              <div className="max-h-[350px] overflow-y-auto">
                {isLoadingUsers ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  allUsers
                    .filter(user => {
                      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
                      return fullName.includes(searchUserQuery) || 
                            (user.email || "").toLowerCase().includes(searchUserQuery);
                    })
                    .map(user => {
                      // ตรวจสอบว่าเป็นผู้ติดต่อที่มีอยู่แล้วหรือไม่
                      const isExistingContact = chatContacts.some(c => c.email === user.email);
                      
                      return (
                        <div 
                          key={user.email}
                          className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50"
                        >
                          <div className="flex-shrink-0">
                            <img
                              src={user.avatar || "https://via.placeholder.com/150"}
                              alt="Avatar"
                              className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            />
                          </div>
                          
                          <div className="ml-3 flex-1">
                            <div className="font-medium text-gray-800">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                          
                          {isExistingContact ? (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              Already added
                            </span>
                          ) : (
                            <button
                              onClick={() => addFriend(user)}
                              className="ml-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                            >
                              <IoPersonAdd size={18} />
                            </button>
                          )}
                        </div>
                      );
                    })
                )}
                
                {!isLoadingUsers && allUsers.filter(user => {
                  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
                  return fullName.includes(searchUserQuery) || 
                        (user.email || "").toLowerCase().includes(searchUserQuery);
                }).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found matching your search.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;