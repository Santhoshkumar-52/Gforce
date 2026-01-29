import express from "express";
const commonRouter = express.Router()
import dotenv from "dotenv";
import planmaster from "../../model/planmaster.js";
import gstmaster from "../../model/gstmaster.js";
import staffmaster from "../../model/staffmaster.js";
import discountmaster from "../../model/discountmaster.js";
import Branchmaster from "../../model/branchmaster.js";
import mongoose from "mongoose";

dotenv.config()

commonRouter.post('/planid', async (req, res) => {
    const { branchid } = req.body;
    if (!branchid) {
        return res.status(400).json({ status: "error", message: "branchid and groupid are never received in DB request" })
    }
    try {
        const plans = await planmaster.find({
            $and: [{ is_active: true }, { branchId: branchid }]
        },
        );


        if (!plans.length) {
            return res.status(404).json({
                status: "error",
                message: "No Plans Found"
            });
        }
        console.log("Fetched Plans");

        res.status(200).json({
            status: "success",
            planids: plans
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Server error",
            error: err.message
        });
    }
});
commonRouter.post('/gstid', async (req, res) => {
    const { branchid, groupid } = req.body;
    if (!branchid || !groupid) {
        return res.status(400).json({ status: "error", message: "branchid and groupid are never received in DB request" })
    }
    try {
        const gstids = await gstmaster.find(
            {
                $and: [{ is_active: true }, { branchId: branchid }]
            },
        );


        if (!gstids.length) {
            return res.status(404).json({
                status: "error",
                message: "No gstids Found"
            });
        }
        console.log("testing");

        res.status(200).json({
            status: "success",
            gstids: gstids
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Server error",
            error: err.message
        });
    }
});
commonRouter.post('/staffid', async (req, res) => {
    const { branchid, groupid } = req.body;
    if (!branchid || !groupid) {
        return res.status(400).json({ status: "error", message: "branchid and groupid are never received in DB request" })
    }
    try {
        const staffids = await staffmaster.find(
            { $and: [{ branchId: branchid }, { activeStatus: true }, { groupId: { $ne: groupid } }] },
        );


        if (!staffids.length) {
            return res.status(404).json({
                status: "error",
                message: "No staffid Found"
            });
        }

        res.status(200).json({
            status: "success",
            staffids
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Server error",
            error: err.message
        });
    }
});
commonRouter.post('/clientid', async (req, res) => {
    const { branch } = req.body;  // string from JSON

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
                message: "No branches found"
            });
        }

        res.status(200).json({
            status: "success",
            branchid: branches
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Server error",
            error: err.message
        });
    }
});
commonRouter.post('/discountid', async (req, res) => {
    const { branchid, groupid } = req.body;
    if (!branchid || !groupid) {
        return res.status(400).json({ status: "error", message: "branchid and groupid are never received in DB request" })
    }
    try {
        const discountcategoryid = await discountmaster.find(
            { $and: [{ branchId: branchid }, { activestatus: true },] },
        );
        if (!discountcategoryid.length) {
            return res.status(404).json({
                status: "error",
                message: "No Discounts Found"
            });
        }

        res.status(200).json({
            status: "success",
            discountcategoryid
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Server error",
            error: err.message
        });
    }
});





export default commonRouter;