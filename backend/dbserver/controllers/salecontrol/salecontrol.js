import express from "express";
import mongoose from "mongoose";

import salemaster from "../../model/salemaster.js";
import memberplan from "../../model/memberplan.js";

const salerouter = express.Router();

salerouter.post("/addsale", async (req, res) => {
    const { saleMasterData, memberPlanData } = req.body;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { saleMasterData, memberPlanData } = req.body;

        if (!saleMasterData || !Array.isArray(memberPlanData)) {
            throw new Error("Invalid payload");
        }

        /* ---------------- SAVE SALE MASTER ---------------- */
        await salemaster.create(
            [saleMasterData],
            { session }
        );

        /* ---------------- SAVE MEMBER PLANS ---------------- */
        await memberplan.insertMany(
            memberPlanData,
            { session }
        );

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

export default salerouter;