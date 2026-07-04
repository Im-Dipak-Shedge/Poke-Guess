import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import roomRouter from "./routes/roomRouter.js";

dotenv.config();

const app = express();

//Connecting Database
connectDB();

//cross-origin resource sharing (CORS) middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use("/api/rooms", roomRouter);

app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});