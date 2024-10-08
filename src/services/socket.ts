// src/services/socket.js
import { io } from "socket.io-client";
import toast from "solid-toast";

// Initialize Socket.IO client
const socket = io(import.meta.env.VITE_BACKEND_PORT_URL, {
  withCredentials: true, // Send cookies with requests
});

// Handle connection errors
socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
  toast.error(`Socket connection error: ${err.message}`);
});

export default socket;
