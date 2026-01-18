// socket.js
import { io } from "socket.io-client";

let socket;

export const initSocket = (token) => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket"],
      auth: { token }, // optional if server requires
    });
  }
  return socket;
};

export const getSocket = () => socket;
