import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

// realtime message code goes here
export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

const users = {};

// used to listen events on server side.
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log("Hello ", users);
  }
  // used to send the events to all connected users
  io.emit("getOnlineUsers", Object.keys(users));

  // used to listen client side events emitted by server side (server & client)
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, io, server };












// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// // Import routes
// import userRoutes from "./routes/user.route.js";
// import messageRoutes from "./routes/message.route.js";
// import groupRoutes from "./routes/group.route.js";

// // Import socket configuration
// import { app, server } from "./SocketIO/server.js";

// dotenv.config();

// const PORT = process.env.PORT || 4002;
// const URI = process.env.MONGODB_URI;

// // Middleware
// app.use(cors({
//   origin: "http://localhost:3001", // Make sure this matches your frontend port
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(express.json());
// app.use(cookieParser());

// // Routes
// app.use("/api/user", userRoutes);
// app.use("/api/message", messageRoutes);
// app.use("/api/group", groupRoutes); // Add this line for group routes

// // Database connection
// try {
//   mongoose.connect(URI);
//   console.log("Connected to MongoDB");
// } catch (error) {
//   console.log("Error connecting to MongoDB:", error);
// }

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });