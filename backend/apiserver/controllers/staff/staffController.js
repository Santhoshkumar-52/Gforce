import express, { text } from "express";
import dotenv from "dotenv";
import staffmaster from "../../model/staffmaster.js";
import mongoose from "mongoose";

dotenv.config();

const staffRouter = express.Router();

staffRouter.get("/", async (req, res) => {
  const { ObjectId } = mongoose.Types;
  const branchid = req.query.branchid;

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
staffRouter.post("/update", async (req, res) => {
  try {
    const { _id, staffId, fullName, groupId, activeStatus, mobile } = req.body;

    // Validation
    if (!_id || !staffId || !fullName || !mobile) {
      return res.status(400).json({
        status: "error",
        title: "Validation Error",
        text: "Staff ID, Full Name and Mobile are required fields",
      });
    }

    // Check duplicate staffId
    const existingStaffId = await staffmaster.findOne({
      staffId: staffId.trim(),
      _id: { $ne: _id },
    });

    if (existingStaffId) {
      return res.status(400).json({
        status: "error",
        title: "Duplicate Staff ID",
        text: "Staff ID already exists",
      });
    }

    // Check duplicate mobile
    const existingMobile = await staffmaster.findOne({
      mobile: mobile.trim(),
      _id: { $ne: _id },
    });

    if (existingMobile) {
      return res.status(400).json({
        status: "error",
        title: "Duplicate Mobile",
        text: "Mobile number already exists",
      });
    }

    const updatedStaff = await staffmaster.findByIdAndUpdate(
      _id,
      {
        $set: {
          staffId: staffId.trim(),
          fullName: fullName.trim(),
          groupId,
          mobile: mobile.trim(),
          activeStatus,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedStaff) {
      return res.status(404).json({
        status: "error",
        title: "Staff Not Found",
        text: "No staff record found",
      });
    }

    return res.status(200).json({
      status: "success",
      title: "Staff Updated",
      text: "Staff details updated successfully",
      data: updatedStaff,
    });
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        title: "Duplicate Entry",
        text: "Duplicate value already exists",
      });
    }

    return res.status(500).json({
      status: "error",
      title: "Server Error",
      text: error.message || "Something went wrong",
    });
  }
});
staffRouter.post("/add", async (req, res) => {
  try {
    const {
      staffId,
      fullName,
      groupId,
      activeStatus,
      mobile,
      branchId,
    } = req.body;

    // Validation
    if (!staffId || !fullName || !mobile || !groupId || !branchId) {
      return res.status(400).json({
        status: "error",
        title: "Validation Error",
        text: "Please fill all required fields",
      });
    }

    // Check duplicate Staff ID
    const existingStaffId = await staffmaster.findOne({
      staffId: staffId.trim(),
    });

    if (existingStaffId) {
      return res.status(400).json({
        status: "error",
        title: "Duplicate Staff ID",
        text: "Staff ID already exists",
      });
    }

    // Check duplicate Mobile
    const existingMobile = await staffmaster.findOne({
      mobile: mobile.trim(),
    });

    if (existingMobile) {
      return res.status(400).json({
        status: "error",
        title: "Duplicate Mobile",
        text: "Mobile number already exists",
      });
    }

    // Save Staff
    const newStaff = await staffmaster.create({
      staffId: staffId.trim(),
      fullName: fullName.trim(),
      groupId,
      mobile: mobile.trim(),
      branchId,
      activeStatus,
    });

    return res.status(201).json({
      status: "success",
      title: "Staff Added",
      text: "Staff added successfully",
      data: newStaff,
    });
  } catch (error) {
    console.log(error);

    // Mongo duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        title: "Duplicate Entry",
        text: "Duplicate value already exists",
      });
    }

    return res.status(500).json({
      status: "error",
      title: "Server Error",
      text: error.message || "Something went wrong",
    });
  }
});
export default staffRouter;
