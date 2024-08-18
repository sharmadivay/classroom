import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./db/connectDB.js";
import userRoutes from "./routes/userRoute.js";
import classroomRoutes from "./routes/classroomRoutes.js";
import path from "path";
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/classroom", classroomRoutes);

const PORT = process.env.PORT || 5000;

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------
app.listen(PORT, async () => {
  await connect();
  console.log(`Server listening on port ${PORT}`);
});
