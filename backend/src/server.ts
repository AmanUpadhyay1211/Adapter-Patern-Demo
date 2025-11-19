import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDatabase, sequelize } from "./config/database";
import studentRoutes from "./routes/studentRoutes";
import { ensureSeedData } from "./services/studentService";
import { initializeVersion } from "./services/versionService";
import "./models/meta"; // Import to ensure model is registered
import "./models/student"; // Import to ensure model is registered

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Make io available to routes via app.locals
app.locals.io = io;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/students", studentRoutes);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

async function start() {
  await connectDatabase();
  await sequelize.sync();
  await initializeVersion();
  await ensureSeedData();

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.io server ready`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

