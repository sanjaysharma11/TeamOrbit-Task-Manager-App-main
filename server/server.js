require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reportRoutes = require("./routes/reportRoutes");
const { createMessage } = require("./controllers/messageController");

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reports", reportRoutes);

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Health check route (for Vercel or any uptime monitor)
app.get("/api/status", (req, res) => {
  res.json({
    status: "Backend is running ✅",
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("TeamOrbit Task Manager API is running.");
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", async ({ from, to, text }) => {
    try {
      const message = await createMessage({ from, to, text });
      if (message) io.emit("receive_message", message);
    } catch (error) {
      io.emit("error_sending_message", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Server startup
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});