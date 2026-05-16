import express from "express";
import CardService from "./CardService.js";
import ChartService from "./ChartService.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/", async (req, res) => {
  console.log("Fetching Dashboard Data:", req.query);

  try {
    const [chartresult, cardresult] = await Promise.allSettled([
      ChartService(req.query),
      CardService(req.query),
    ]);

    console.log("Dashboard Data Fetched!");

    return res.status(200).json({
      charts: chartresult.status === "fulfilled" ? chartresult.value : {},

      cards: cardresult.status === "fulfilled" ? cardresult.value : [],
    });
  } catch (err) {
    console.error("Dashboard Error:", err);

    return res.status(500).json({
      success: false,
      message: "Error processing dashboard data",
    });
  }
});

export default dashboardRouter;
