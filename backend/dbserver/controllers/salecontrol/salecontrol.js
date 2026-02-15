import express from "express";
import mongoose from "mongoose";

import salemaster from "../../model/salemaster.js";
import memberplan from "../../model/memberplan.js";

const salerouter = express.Router();

salerouter.post("/addsale", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { saleMasterData, memberPlanData } = req.body;
    console.log("sales", saleMasterData);
    console.log("member", memberPlanData);

    if (!saleMasterData || !Array.isArray(memberPlanData)) {
      throw new Error("Invalid payload");
    }

    /* ---------------- SAVE SALE MASTER ---------------- */
    await salemaster.create([saleMasterData], { session });

    /* ---------------- SAVE MEMBER PLANS ---------------- */
    await memberplan.insertMany(memberPlanData, { session });

    /* ---------------- COMMIT ---------------- */
    await session.commitTransaction();
    session.endSession();

    return res.json({
      status: "success",
    });
  } catch (err) {
    /* ---------------- ROLLBACK ---------------- */
    await session.abortTransaction();
    session.endSession();

    console.error("❌ DB TRANSACTION FAILED:", err.message);

    return res.status(500).json({
      status: "error",
      message: "Transaction failed, nothing saved",
    });
  }
});

salerouter.get("/invoice/:saleUniqueId", async (req, res) => {
  const saleUniqueId = req.params.saleUniqueId;
  try {
    const data = await salemaster.aggregate([
      { $match: { saleUniqueId } },
      {
        $lookup: {
          from: "memberplan",
          localField: "saleUniqueId",
          foreignField: "saleUniqueId",
          as: "mbp",
        },
      },
      {
        $lookup: {
          from: "planmaster",
          localField: "mbp.planId",
          foreignField: "_id",
          as: "plm",
        },
      },
      {
        $lookup: {
          from: "membermaster",
          localField: "mbp.memberId",
          foreignField: "_id",
          as: "mbm",
        },
      },
      {
        $lookup: {
          from: "staffmaster",
          localField: "mbp.allotedstaff",
          foreignField: "_id",
          as: "stm",
        },
      },
      {
        $lookup: {
          from: "staffmaster",
          localField: "creadtedBy",
          foreignField: "_id",
          as: "sstm",
        },
      },
      {
        $lookup: {
          from: "groupmaster",
          localField: "sstm.groupId",
          foreignField: "_id",
          as: "gpm",
        },
      },
      {
        $lookup: {
          from: "branchmaster",
          localField: "branchId",
          foreignField: "_id",
          as: "bcm",
        },
      },
      { $unwind: "$mbp" },
      { $unwind: "$plm" },
      { $unwind: "$mbm" },
      { $unwind: "$sstm" },
      { $unwind: "$stm" },
      { $unwind: "$gpm" },
      { $unwind: "$bcm" },
      {
        $project: {
          // PLAN
          plan_name: "$plm.plan_name",

          // MEMBER
          membername: {
            $concat: ["$mbm.firstname", " ", "$mbm.lastname"],
          },
          memberid: "$mbm.customerId",

          // STAFF
          allotedstaff: "$stm.fullName",
          createdStaff: "$sstm.fullName",
          createdStaffGorup: "$gpm.groupName",

          // SALEMASTER (remaining)
          billno: 1,
          saleDate: 1,
          baseAmount: 1,
          discountAmount: 1,
          gstAmount: 1,
          nettAmount: 1,
          paidAmount: 1,
          balance: 1,
          change: 1,
          paymentMode: 1,
          status: 1,

          // MEMBERPLAN (remaining)
          startDate: "$mbp.startDate",
          expiryDate: "$mbp.expiryDate",
          isActive: "$mbp.isActive",
          isExpired: "$mbp.isExpired",
          cancelled: "$mbp.cancelled",
          branchname: "$bcm.branchname",
          location: "$bcm.location",
          address: "$bcm.address",
          mobile: "$bcm.mobile",
          GSTNo: "$bcm.GSTNo",
          branchImage: "$bcm.branchImage",

          _id: 0,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default salerouter;
