import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import ChartService from "./ChartService.js";

dotenv.config();

const dashboardRouter = express.Router();
dashboardRouter.get("/", async (req, res) => {
  try {
    const chartresult = await ChartService(req.query);
    res.json({
      charts: chartresult,
    });
  } catch (err) {
    res.status(500).json({ error: "Error processing dashboard data" });
  }
});
export default dashboardRouter;
