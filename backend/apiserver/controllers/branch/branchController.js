import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import branchmaster from "../../model/branchmaster.js";

dotenv.config();

const branchSettingsRouter = express.Router();

/* =========================================================
   GET BRANCH SETTINGS
========================================================= */
branchSettingsRouter.get("/", async (req, res) => {
  try {
    const { branchid } = req.query;

    if (!branchid) {
      return res.status(400).json({
        status: "error",
        text: "Branch ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(branchid)) {
      return res.status(400).json({
        status: "error",
        text: "Invalid Branch ID",
      });
    }

    const branchDetails = await branchmaster.findById(branchid);

    if (!branchDetails) {
      return res.status(404).json({
        status: "error",
        text: "Branch not found",
      });
    }

    return res.status(200).json({
      status: "success",
      branchDetails,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "error",
      text: error.message || "Something went wrong",
    });
  }
});

/* =========================================================
   UPDATE BRANCH SETTINGS
========================================================= */
branchSettingsRouter.post("/update", async (req, res) => {
  try {
    const {
      _id,
      branchname,
      brancuniqueid,
      address,
      mobile,
      GSTNo,
      OwnershipType,
      activeStatus,
      location,
      branchlogo,
    } = req.body;

    if (!_id || !branchname || !mobile || !OwnershipType) {
      return res.status(400).json({
        status: "error",
        text: "Please fill all required fields",
      });
    }

    const updatedBranch = await branchmaster.findByIdAndUpdate(
      _id,
      {
        $set: {
          branchname: branchname.trim(),
          brancuniqueid: Number(brancuniqueid),
          address: address?.trim() || "",
          mobile: Number(mobile),
          GSTNo: GSTNo?.trim() || "",
          OwnershipType: OwnershipType?.trim() || "",
          activeStatus,
          location: location?.trim() || "",
          branchlogo: branchlogo?.trim() || "",
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      status: "success",
      text: "Branch settings updated successfully",
      data: updatedBranch,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "error",
      text: error.message || "Something went wrong",
    });
  }
});

export default branchSettingsRouter;
