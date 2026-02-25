import express from "express";
const commonRouter = express.Router();
import axios from "axios";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

import planmaster from "../model/planmaster.js";
import gstmaster from "../model/gstmaster.js";
import staffmaster from "../model/staffmaster.js";
import discountmaster from "../model/discountmaster.js";
import Branchmaster from "../model/branchmaster.js";
import mongoose from "mongoose";

const DBSERVERURL = process.env.DBSERVERURL;
const secretekey = process.env.JWT_SECRET_KEY;

function converttoken(data) {
  const payload = {
    data,
  };
  const token = jwt.sign(payload, secretekey, { expiresIn: "7d" });
  return token;
}

commonRouter.post("/planid", async (req, res) => {
  const { branchid, groupid } = req.body;
  if (!branchid || !groupid) {
    return res.status(400).json({
      status: "error",
      message: "branchid and groupid are never received in api request",
    });
  }
  try {
    const plans = await planmaster.find({
      $and: [{ is_active: true }, { branchId: branchid }],
    });

    if (!plans.length) {
      return res.status(404).json({
        status: "error",
        message: "No Plans Found",
      });
    }
    console.log("Fetched Plans");
    const planids = converttoken(plans);
    res.status(200).json({
      status: "success",
      planids,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
});
commonRouter.post("/gstid", async (req, res) => {
  const { branchid, groupid } = req.body;
  if (!branchid || !groupid) {
    return res.status(400).json({
      status: "error",
      message: "branchid and groupid are never received in api request",
    });
  }

  try {
    const gstids = await gstmaster.find({
      $and: [{ is_active: true }, { branchId: branchid }],
    });

    if (!gstids.length) {
      return res.status(404).json({
        status: "error",
        message: "No gstids Found",
      });
    }
    console.log("Fetched GST");
    const gst = converttoken(gstids);
    res.status(200).json({
      status: "success",
      gstids: gst,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
});
commonRouter.post("/staffid", async (req, res) => {
  const { branchid, groupid } = req.body;
  if (!branchid || !groupid) {
    return res.status(400).json({
      status: "error",
      message: "branchid and groupid are never received in api request",
    });
  }
  // try {
  //   const response = await axios.post(`${DBSERVERURL}/db/commonvalue/staffid`, {
  //     branchid,
  //     groupid,
  //   });
  //   const staffids = converttoken(response.data.staffids);
  //   res.status(200).json({ staffids });
  // } catch (err) {
  //   res.status(500).json({ status: "error", message: err.message });
  // }

  try {
    const staffids = await staffmaster.find({
      $and: [
        { branchId: branchid },
        { activeStatus: true },
        { groupId: { $ne: groupid } },
      ],
    });

    if (!staffids.length) {
      return res.status(404).json({
        status: "error",
        message: "No staffid Found",
      });
    }
    const staffs = converttoken(staffids);
    console.log("Fetched Staffs");
    res.status(200).json({
      status: "success",
      staffids: staffs,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
});
commonRouter.post("/discountid", async (req, res) => {
  const { branchid, groupid } = req.body;
  if (!branchid) {
    return res.status(400).json({
      status: "error",
      message: "branchid and groupid are never received in api request",
    });
  }
  try {
    const discountcategoryid = await discountmaster.find({
      $and: [{ branchId: branchid }, { activestatus: true }],
    });
    if (!discountcategoryid.length) {
      return res.status(404).json({
        status: "error",
        message: "No Discounts Found",
      });
    }
    const discount = converttoken(discountcategoryid);
    console.log("Fetched Discounts");
    res.status(200).json({
      status: "success",
      discountcategoryid: discount,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
});
commonRouter.post("/clientid", async (req, res) => {
  const { branch } = req.body || "";

  try {
    // Always filter by activeStatus
    const query = { activeStatus: true };

    // If branch exists, convert to ObjectId
    if (branch) {
      query._id = new mongoose.Types.ObjectId(branch);
    }

    // Fetch branches
    const branches = await Branchmaster.find(query).lean();

    if (!branches.length) {
      return res.status(404).json({
        status: "error",
        message: "No branches found",
      });
    }
    const branchid = converttoken(branches);
    console.log("Fetched Branches");
    res.status(200).json({
      status: "success",
      branchid,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
});
commonRouter.post("/getbranchdetails", async (req, res) => {
  const { branchid } = req.body || "";

  const result = await Branchmaster.findById(branchid);
  console.log("Fetched Branch Details");
  const branchdata = converttoken(result);
  res.status(200).json({
    status: "success",
    branchdata,
  });
});

export default commonRouter;
