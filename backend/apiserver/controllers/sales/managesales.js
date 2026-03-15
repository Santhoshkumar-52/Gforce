import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";

import salemaster from "../../model/salemaster.js";
import memberplan from "../../model/memberplan.js";

dotenv.config();

const salerouter = express.Router();
salerouter.post("/addsale", async (req, res) => {
  const session = await mongoose.startSession();
  const { sales, summary, payment, branchid, staffid } = req.body;

  /* ---------------- VALIDATION ---------------- */

  if (
    !Array.isArray(sales) ||
    sales.length === 0 ||
    !summary ||
    !summary.totalAmount ||
    !branchid ||
    !staffid ||
    !payment
  ) {
    return res.status(500).json({
      error: "Missing required sale data",
    });
  }

  /* ---------------- SALE MASTER DATA ---------------- */

  const saleUniqueId =
    Date.now().toString().slice(-9) +
    Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");

  const totalmode = payment.cash + payment.card + payment.upi;

  const balance =
    summary.totalAmount > totalmode ? summary.totalAmount - totalmode : 0;

  const change =
    summary.totalAmount < totalmode ? totalmode - summary.totalAmount : 0;

  const saleMasterData = {
    branchId: branchid,

    billno: sales[0].billno, // SI/73592
    saleUniqueId: saleUniqueId, // GENERATED ID

    saleDate: sales[0].saledate,
    memberId: sales[0].memberid,
    creadtedBy: staffid,

    baseAmount: summary.totalBasePrice,
    discountAmount: summary.totalDiscount || 0,
    gstPercent: summary.totalGST || 0,
    gstAmount: summary.totalGST || 0,
    nettAmount: summary.totalAmount,
    paidAmount: totalmode,
    balance,
    change,
    paymentMode: {
      cash: payment.cash || 0,
      card: payment.card || 0,
      upi: payment.upi || 0,
    },
  };

  /* ---------------- MEMBER PLAN DATA ---------------- */

  const memberPlanData = [];

  for (const item of sales) {
    if (
      !item.plan ||
      !item.billno ||
      !item.duration ||
      Number(item.duration) <= 0
    ) {
      return res.status(500).json({
        error: "Missing or invalid member plan fields",
      });
    }

    memberPlanData.push({
      branchId: branchid,
      memberId: item.memberid,
      planId: item.plan,
      saleUniqueId: saleUniqueId, // SAME ID
      startDate: item.startDate,
      expiryDate: item.expiryDate,
      durationInMonths: Number(item.duration),
      allotedstaff: item.staff,
      isActive: true,
      isExpired: false,
    });
  }

  try {
    session.startTransaction();

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

    res.json({
      saleUniqueId,
      status: "success",
      message: "Sale Generated Successfully",
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
  /* ---------------- TEMP RESPONSE ---------------- */
});
salerouter.get("/getsaledetail/:saleUniqueId", async (req, res) => {
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
          branchlogo: "$bcm.branchlogo",

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
