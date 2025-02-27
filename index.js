import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contacts_routes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messages_routes from "./routes/MessagesRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contacts_routes);
app.use("/api/messages", messages_routes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

setupSocket(server);

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Error connecting database: " + err);
  });
