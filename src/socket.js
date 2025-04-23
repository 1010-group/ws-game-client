import { io } from "socket.io-client";

// Server URL-ni bu yerda belgilang
const socket = io("https://ws-game-server.onrender.com/");

export default socket;
