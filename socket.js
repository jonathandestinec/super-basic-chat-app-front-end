import { io } from "socket.io-client";
export const socket = io("https://super-basic-chat-app.onrender.com", {
  transports: ["websocket"],
});
