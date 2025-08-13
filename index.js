// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import userRoute from "./routes/user.route.js";
// import messageRoute from "./routes/message.route.js";
// import { app, server } from "./SocketIO/server.js";
// //group line 11 only
// import groupRoutes from "./routes/group.route.js";


// dotenv.config();

// // middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors());

// const PORT = process.env.PORT || 3001;
// const URI = process.env.MONGODB_URI;
// console.log('MONGODB_URI:', process.env.MONGODB_URI);

// // MongoDB connection
// mongoose.connect(URI)
//     .then(() => console.log("Mongodb connected"))
//     .catch((error) => {
//         console.error("MongoDB connection error:", error);
//         process.exit(1); // Exit the process if unable to connect to MongoDB
//     });

// // routes
// app.use("/api/user", userRoute);
// app.use("/api/message", messageRoute);
// //group line 37
// app.use("/api/group", groupRoutes);

// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });











import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import routes
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import groupRoutes from "./routes/group.route.js";

// Import socket configuration
import { app, server } from "./SocketIO/server.js";

dotenv.config();

const PORT = process.env.PORT || 4002;
const URI = process.env.MONGODB_URI;

// Middleware
app.use(cors({
  origin: "http://localhost:3001", // Make sure this matches your frontend port
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/group", groupRoutes); // Add this line for group routes

// Database connection
try {
  mongoose.connect(URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log("Error connecting to MongoDB:", error);
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});