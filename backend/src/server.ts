import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDatabase, sequelize } from "./config/database";
import studentRoutes from "./routes/studentRoutes";
import { ensureSeedData } from "./services/studentService";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/students", studentRoutes);

async function start() {
  await connectDatabase();
  await sequelize.sync();
  await ensureSeedData();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

