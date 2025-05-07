import { useVerifyToken } from "../api/auth";
// websocketManager.ts
let socket: WebSocket | null = null;

export const initWebSocket = (jwt: string, onMessage?: (data: any) => void) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = new WebSocket("wss://alumni.cpe.kmutt.ac.th/api/v1/ws", [jwt]);

    socket.onopen = () => {
      console.log("WebSocket connected");
      if (onMessage) {
        socket!.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            onMessage(data);
          } catch (err) {
            console.error("WebSocket parse error", err);
          }
        };
      }
    };

    socket.onclose = () => console.log("WebSocket closed");
    socket.onerror = (e) => console.error("WebSocket error", e);
  }
};

export const getWebSocket = () => socket;

export const addWebSocketListener = (cb: (data: any) => void) => {
  if (socket) {
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      cb(data);
    };
  }
};

export const sendMessage = (msg: any) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  }
};
