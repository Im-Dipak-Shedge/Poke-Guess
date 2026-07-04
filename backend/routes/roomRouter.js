import express from "express";
import { createRoom } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/create", createRoom);

export default roomRouter;