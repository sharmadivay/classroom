import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./db/connectDB.js";
import userRoutes from "./routes/userRoute.js";
import classroomRoutes from "./routes/classroomRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/classroom", classroomRoutes);

const PORT = process.env.PORT || 5000;

// --------------------------deployment------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  app.use(express.static(path.resolve(__dirname, "client", "dist")));
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

// --------------------------deployment------------------------------
app.listen(PORT, async () => {
  await connect();
  console.log(`Server listening on port ${PORT}`);
});
