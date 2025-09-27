import { io } from "socket.io-client";
import { APP_CONFIG } from "../utils/constants";

let socketInstance = null;

export function getSocket() {
  if (!socketInstance) {
    socketInstance = io(APP_CONFIG.API_BASE_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
  }
  return socketInstance;
}

export function joinDebateRoom(debateId) {
  const socket = getSocket();
  socket.emit("joinDebate", debateId);
}

export function leaveDebateRoom(debateId) {
  const socket = getSocket();
  socket.emit("leaveDebate", debateId);
}

export function sendNewMessage({ debateId, userId, text }, ack) {
  const socket = getSocket();
  socket.emit("newMessage", { debateId, userId, text }, ack);
}

export function onMessageAdded(handler) {
  const socket = getSocket();
  socket.on("messageAdded", handler);
  return () => socket.off("messageAdded", handler);
}


