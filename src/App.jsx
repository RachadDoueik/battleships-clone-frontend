import { useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";
import HomePage from "./pages/HomePage";

// Auto-detect server URL based on environment
const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'https://battleships-clone-backend.onrender.com/'  // Replace with your actual Render URL
  : 'localhost:3000';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  maxReconnectionAttempts: 5
});

function App() {
  return <HomePage />;
}

export default App;
