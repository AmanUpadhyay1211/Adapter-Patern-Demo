import { Sequelize } from "sequelize";
import path from "path";

const databasePath = path.join(__dirname, "../../data/students.sqlite");

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: databasePath,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log("📦 Connected to SQLite successfully");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

