// websocketService.jsx
class WebSocketService {
    constructor() {
      this.ws = null;
      this.subscribers = new Set();
    }
  
    connect(userId) {
      // ในการใช้งานจริง ให้เปลี่ยน URL เป็น WebSocket server ของคุณ
      this.ws = new WebSocket(`ws://localhost:8080/ws?userId=${userId}`);
  
      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.sendOnlineStatus(true);
      };
  
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.notifySubscribers(data);
      };
  
      this.ws.onclose = () => {
        console.log('WebSocket Disconnected');
        // พยายามเชื่อมต่อใหม่
        setTimeout(() => this.connect(userId), 3000);
      };
    }
  
    sendMessage(message) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'message',
          ...message
        }));
      }
    }
  
    sendTypingStatus(receiverId, isTyping) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'typing',
          receiverId,
          isTyping
        }));
      }
    }
  
    sendOnlineStatus(isOnline) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'status',
          isOnline
        }));
      }
    }
  
    subscribe(callback) {
      this.subscribers.add(callback);
      return () => this.subscribers.delete(callback);
    }
  
    notifySubscribers(data) {
      this.subscribers.forEach(callback => callback(data));
    }
  
    disconnect() {
      if (this.ws) {
        this.sendOnlineStatus(false);
        this.ws.close();
      }
    }
  }
  
  export const wsService = new WebSocketService();