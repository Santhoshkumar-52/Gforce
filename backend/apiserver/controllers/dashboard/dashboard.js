import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const dashboardRouter = express.Router();
dashboardRouter.get("/", async (req, res) => {
  res.json({
    status: "success",
    message: "Dashboard data endpoint is working",
  });
});
export default dashboardRouter;
