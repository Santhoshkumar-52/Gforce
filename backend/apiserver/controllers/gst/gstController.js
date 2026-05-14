import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import gstmaster from "../../model/gstmaster.js";

dotenv.config();

const gstRouter = express.Router();

/* =========================================================
   GET GST BY BRANCH
========================================================= */
gstRouter.get("/", async (req, res) => {
  try {
    const { branchid } = req.query;

    if (!branchid) {
      return res.status(400).json({
        status: "error",
        title: "Branch ID Missing",
        text: "Branch ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(branchid)) {
      return res.status(400).json({
        status: "error",
        title: "Invalid Branch ID",
        text: "Invalid branch id received",
      });
    }

    const gstDetails = await gstmaster.find({
      branchId: branchid,
    });

    return res.status(200).json({
      status: "success",
      gstDetails,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "error",
      title: "Server Error",
      text: error.message || "Something went wrong",
    });
  }
});

/* =========================================================
   ADD GST
========================================================= */
gstRouter.post("/add", async (req, res) => {
  try {
    const { branchId, gstname, value, is_active } = req.body;

    if (!branchId || !gstname || value === "" || value == null) {
      return res.status(400).json({
        status: "error",
        title: "Validation Error",
        text: "Please fill all required fields",
      });
    }

    const existingGst = await gstmaster.findOne({
      branchId,
      gstname: gstname.trim(),
    });

    if (existingGst) {
      return res.status(400).json({
        status: "error",
        title: "Duplicate GST",
        text: "GST Name already exists",
      });
    }

    const newGst = await gstmaster.create({
      branchId,
      gstname: gstname.trim(),
      value: Number(value),
      is_active,
    });

    return res.status(201).json({
      status: "success",
      title: "GST Added",
      text: "GST added successfully",
      data: newGst,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "error",
      title: "Server Error",
      text: error.message || "Something went wrong",
    });
  }
});

/* =========================================================
   UPDATE GST
========================================================= */
gstRouter.post("/update", async (req, res) => {
  try {
    const { _id, gstname, value, is_active } = req.body;

    if (!_id || !gstname || value === "" || value == null) {
      return res.status(400).json({
        status: "error",
        title: "Validation Error",
        text: "Please fill all required fields",
      });
    }

    const existingGst = await gstmaster.findOne({
      gstname: gstname.trim(),
      _id: { $ne: _id },
    });

    if (existingGst) {
      return res.status(400).json({
        status: "error",
        title: "Duplicate GST",
        text: "GST Name already exists",
      });
    }

    const updatedGst = await gstmaster.findByIdAndUpdate(
      _id,
      {
        $set: {
          gstname: gstname.trim(),
          value: Number(value),
          is_active,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedGst) {
      return res.status(404).json({
        status: "error",
        title: "GST Not Found",
        text: "No GST record found",
      });
    }

    return res.status(200).json({
      status: "success",
      title: "GST Updated",
      text: "GST updated successfully",
      data: updatedGst,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "error",
      title: "Server Error",
      text: error.message || "Something went wrong",
    });
  }
});

export default gstRouter;
