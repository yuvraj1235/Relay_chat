// server/index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// ✅ CORS Setup – replace * with your frontend origin in production
app.use(cors({
  origin: "http://localhost:3000", // Replace with your Next.js app URL
  methods: ["GET", "POST"]
}));

app.get("/", (req, res) => res.send("Socket.IO server is running!"));

const server = http.createServer(app);

// ✅ Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Match frontend origin
    methods: ["GET", "POST"],
  },
});

// ✅ Socket.IO logic
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // When a user joins a room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`📥 User ${socket.id} joined room: ${roomId}`);
  });

  // When a user sends a message
  socket.on("send_message", (data) => {
    const { chatId, message, senderId, receiverId, timestamp } = data;

    // ✅ Emit to the specific room
    io.to(chatId).emit("receive_message", data);
    console.log(`📤 Message sent to room ${chatId}:`, message);
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running at http://localhost:${PORT}`);
});
