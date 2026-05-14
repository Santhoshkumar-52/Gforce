import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import discountmaster from "../../model/discountmaster.js";

dotenv.config();

const discountRouter = express.Router();

/* =========================================================
   GET DISCOUNTS
========================================================= */
discountRouter.get("/", async (req, res) => {
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

    const discountDetails = await discountmaster.find({
      branchId: branchid,
    });

    return res.status(200).json({
      status: "success",
      discountDetails,
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
   ADD DISCOUNT
========================================================= */
discountRouter.post("/add", async (req, res) => {
  try {
    const { branchId, discountname, activestatus } = req.body;

    if (!branchId || !discountname) {
      return res.status(400).json({
        status: "error",
        title: "Validation Error",
        text: "Please fill all required fields",
      });
    }

    const existingDiscount = await discountmaster.findOne({
      branchId,
      discountname: discountname.trim(),
    });

    if (existingDiscount) {
      return res.status(400).json({
        status: "error",
        title: "Duplicate Discount",
        text: "Discount name already exists",
      });
    }

    const newDiscount = await discountmaster.create({
      branchId,
      discountname: discountname.trim(),
      activestatus,
    });

    return res.status(201).json({
      status: "success",
      title: "Discount Added",
      text: "Discount added successfully",
      data: newDiscount,
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
   UPDATE DISCOUNT
========================================================= */
discountRouter.post("/update", async (req, res) => {
  try {
    const { _id, discountname, activestatus } = req.body;

    if (!_id || !discountname) {
      return res.status(400).json({
        status: "error",
        title: "Validation Error",
        text: "Please fill all required fields",
      });
    }

    const existingDiscount = await discountmaster.findOne({
      discountname: discountname.trim(),
      _id: { $ne: _id },
    });

    if (existingDiscount) {
      return res.status(400).json({
        status: "error",
        title: "Duplicate Discount",
        text: "Discount name already exists",
      });
    }

    const updatedDiscount = await discountmaster.findByIdAndUpdate(
      _id,
      {
        $set: {
          discountname: discountname.trim(),
          activestatus,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedDiscount) {
      return res.status(404).json({
        status: "error",
        title: "Discount Not Found",
        text: "No discount record found",
      });
    }

    return res.status(200).json({
      status: "success",
      title: "Discount Updated",
      text: "Discount updated successfully",
      data: updatedDiscount,
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

export default discountRouter;
