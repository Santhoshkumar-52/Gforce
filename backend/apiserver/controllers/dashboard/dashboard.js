import express from "express";

import CardService from "./CardService.js";
import ChartService from "./ChartService.js";

const dashboardRouter = express.Router();

const dashboardModules = {
  cards: CardService,
  charts: ChartService,
};

dashboardRouter.get("/", async (req, res) => {
  console.log("Fetching Dashboard Data:", req.query);

  try {
    const entries = Object.entries(dashboardModules);

    const results = await Promise.allSettled(
      entries.map(([_, service]) => service(req.query)),
    );

    const response = {};

    entries.forEach(([key], index) => {
      const result = results[index];

      response[key] =
        result.status === "fulfilled"
          ? result.value
          : key === "cards"
            ? []
            : {};
    });

    console.log("Dashboard Data Fetched!");

    return res.status(200).json(response);
  } catch (err) {
    console.error("Dashboard Error:", err);

    return res.status(500).json({
      success: false,
      message: "Error processing dashboard data",
    });
  }
});

export default dashboardRouter;
