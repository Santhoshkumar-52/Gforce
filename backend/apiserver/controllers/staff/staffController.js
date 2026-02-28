import express, { text } from "express";
import dotenv from "dotenv";
import staffmaster from "../../model/staffmaster.js";
import mongoose from "mongoose";

dotenv.config();

const staffRouter = express.Router();

staffRouter.get("/", async (req, res) => {
  const { ObjectId } = mongoose.Types;
  const branchid = req.query.branchid;
  console.log(branchid);

  if (!branchid) {
    return res.status(400).json({
      status: "error",
      title: "Branch ID never Received",
      text: "Something went wrong, Try Again or Contact Support",
    });
  }
  try {
    const staffDetails = await staffmaster.aggregate([
      {
        $match: {
          branchId: new ObjectId(branchid),
        },
      },
      {
        $lookup: {
          from: "groupmaster",
          localField: "groupId",
          foreignField: "_id",
          as: "groupDetails",
        },
      },
      
    ]);

    return res.status(200).json({
      status: "success",
      staffDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      title: error.message,
      text: "Something went wrong, Try Again or Contact Support",
    });
  }
});

export default staffRouter;
