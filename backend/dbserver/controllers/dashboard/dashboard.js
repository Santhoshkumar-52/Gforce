import express from 'express';
import Membermaster from '../../model/customermaster.js'
import salemaster from "../../model/salemaster.js"
import memberplan from '../../model/memberplan.js';
import mongoose from 'mongoose';
const dashboardRouter = express.Router()


class DashboardService {
    constructor() {

    }

    async getTotalsales({ branchid, fromdate, todate }) {

        const filter = {};

        // Apply branch filter only if not "all"
        if (branchid && branchid !== "all") {

            if (!mongoose.Types.ObjectId.isValid(branchid)) {
                throw new Error("Invalid Branch ID");
            }

            filter.branchId = new mongoose.Types.ObjectId(branchid);
        }

        // Apply date filter only if provided
        if (fromdate && todate) {
            filter.saleDate = {
                $gte: new Date(fromdate),
                $lte: new Date(todate)
            };
        }

        const totalDocuments = await salemaster.countDocuments(filter);

        return totalDocuments;
    }

    async getTotalMembers(branchId) {
        const filter = { branchId }

        const totaldocuments = await Membermaster.countDocuments(filter)

        return totaldocuments
    }

    async getTotalDueMembers(branch) {
        const branchId = new mongoose.Types.ObjectId(branch)
        const filter = {
            branchId,
            status: "PAID",
            balance: { $gt: 0 },
            $expr: { $ne: ["$paidAmount", "$nettAmount"] }
        }

        return await salemaster.countDocuments(filter)
    }

    async getExpiredMembers(branchId) {
        const filter = { branchId, isactive: false }

        const totaldocuments = await Membermaster.countDocuments(filter)

        return totaldocuments
    }
    async getTotlaExpiringMembers(branchId) {
        return await memberplan.countDocuments({
            branchId,
            expiryDate: { $lt: new Date() }
        })

    }
}

const dashboardservice = new DashboardService();

dashboardRouter.post("/carddata", async (req, res) => {
    try {
        const { branchid, fromdate, todate } = req.body;

        console.log("Received Card Data:", branchid, fromdate, todate);

        const data = { branchid, fromdate, todate }

        // Class 
        // const totalsale = await dashboardservice.getTotalsales(data);
        const totalmembers = await dashboardservice.getTotalMembers(branchid)
        const totaldue = await dashboardservice.getTotalDueMembers(branchid)
        const totalexpired = await dashboardservice.getExpiredMembers(branchid)
        const totalrenewals = await dashboardservice.getTotlaExpiringMembers(branchid)

        const result = {  totalmembers, totaldue, totalexpired, totalrenewals }

        res.status(200).json(result)



    } catch (error) {
        console.error("CardData Error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
});
dashboardRouter.post("/chart", (req, res) => {
    const { branchid, fromdate, todate } = req.body
})
export default dashboardRouter
