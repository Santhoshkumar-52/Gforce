import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import ChartService from "./ChartService.js";

dotenv.config();

const dashboardRouter = express.Router();
dashboardRouter.get("/", async (req, res) => {
  console.log("Fetching Chart Data with filters:", req.query);
  try {
    const chartresult = await ChartService(req.query);
    res.json({
      charts: chartresult,
    });

    console.log("Dashboard Charts Fetched !");
  } catch (err) {
    res.status(500).json({ error: "Error processing dashboard data" });
    console.log("Error in Fetch Dashboard Charts !");
  }
});
export default dashboardRouter;
