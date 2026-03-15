import mongoose from "mongoose";
import express from "express";
import salemaster from "../../model/salemaster.js";

const salerepRouter = express.Router();

salerepRouter.get("/getsalereport", async (req, res) => {
  try {
    const { branchid, fromdate, todate } = req.query;

    if (!branchid || !fromdate || !todate) {
      return res.status(400).json({
        icon: "error",
        message: "branchid, fromdate and todate are required",
      });
    }

    const startDate = new Date(fromdate);
    const endDate = new Date(todate);
    endDate.setHours(23, 59, 59, 999);

    const data = await salemaster
      .find({
        branchId: new mongoose.Types.ObjectId(branchid),
        saleDate: { $gte: startDate, $lte: endDate },
      })
      .select(
        "billno saleDate saleType nettAmount paidAmount paymentMode status saleUniqueId",
      )
      .sort({ saleDate: -1 });

    res.json({
      icon: "success",
      count: data.length,
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      icon: "error",
      title: "Something went wrong",
      message: "Try again later",
    });
  }
});
export default salerepRouter;
