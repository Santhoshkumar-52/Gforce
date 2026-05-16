import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import planmaster from "../../model/planmaster.js";

dotenv.config();

const planRouter = express.Router();

/* =========================================================
   GET ALL PLANS BY BRANCH
========================================================= */
planRouter.get("/", async (req, res) => {
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

    const planDetails = await planmaster.find({
      branchId: branchid,
    });

    return res.status(200).json({
      status: "success",
      planDetails,
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
   ADD PLAN
========================================================= */
planRouter.post("/add", async (req, res) => {
  try {
    const {
      branchId,
      plan_name,
      plan_description,
      duration_months,
      price,
      is_active,
    } = req.body;

    if (
      !branchId ||
      !plan_name ||
      duration_months === "" ||
      duration_months == null ||
      price === "" ||
      price == null
    ) {
      return res.status(400).json({
        status: "error",
        title: "Validation Error",
        text: "Please fill all required fields",
      });
    }

    const existingPlan = await planmaster.findOne({
      branchId,
      plan_name: plan_name.trim(),
    });

    if (existingPlan) {
      return res.status(400).json({
        status: "error",
        title: "Duplicate Plan",
        text: "Plan name already exists",
      });
    }

    const newPlan = await planmaster.create({
      branchId,
      plan_name: plan_name.trim(),
      plan_description: plan_description?.trim() || "",
      duration_months: Number(duration_months),
      price: Number(price),
      is_active,
    });

    return res.status(201).json({
      status: "success",
      title: "Plan Added",
      text: "Plan added successfully",
      data: newPlan,
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
   UPDATE PLAN
========================================================= */
planRouter.post("/update", async (req, res) => {
  try {
    const {
      _id,
      plan_name,
      plan_description,
      duration_months,
      price,
      is_active,
    } = req.body;

    if (
      !_id ||
      !plan_name ||
      duration_months === "" ||
      duration_months == null ||
      price === "" ||
      price == null
    ) {
      return res.status(400).json({
        status: "error",
        title: "Validation Error",
        text: "Please fill all required fields",
      });
    }

    const existingPlan = await planmaster.findOne({
      plan_name: plan_name.trim(),
      _id: { $ne: _id },
    });

    if (existingPlan) {
      return res.status(400).json({
        status: "error",
        title: "Duplicate Plan",
        text: "Plan name already exists",
      });
    }

    const updatedPlan = await planmaster.findByIdAndUpdate(
      _id,
      {
        $set: {
          plan_name: plan_name.trim(),
          plan_description: plan_description?.trim() || "",
          duration_months: Number(duration_months),
          price: Number(price),
          is_active,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedPlan) {
      return res.status(404).json({
        status: "error",
        title: "Plan Not Found",
        text: "No plan record found",
      });
    }

    return res.status(200).json({
      status: "success",
      title: "Plan Updated",
      text: "Plan updated successfully",
      data: updatedPlan,
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

export default planRouter;
