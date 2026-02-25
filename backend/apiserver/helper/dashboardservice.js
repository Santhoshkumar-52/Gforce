import Membermaster from "../model/customermaster.js";
import salemaster from "../model/salemaster.js";
import memberplan from "../model/memberplan.js";
import mongoose from "mongoose";

class DashboardService {
  constructor() {}

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
        $lte: new Date(todate),
      };
    }

    const totalDocuments = await salemaster.countDocuments(filter);

    return totalDocuments;
  }

  async getTotalMembers(branchId) {
    const filter = { branchId };

    const totaldocuments = await Membermaster.countDocuments(filter);

    return totaldocuments;
  }

  async getTotalDueMembers(branch) {
    const branchId = new mongoose.Types.ObjectId(branch);
    const filter = {
      branchId,
      status: "PAID",
      balance: { $gt: 0 },
      $expr: { $ne: ["$paidAmount", "$nettAmount"] },
    };

    return await salemaster.countDocuments(filter);
  }

  async getExpiredMembers(branchId) {
    const filter = { branchId, isactive: false };

    const totaldocuments = await Membermaster.countDocuments(filter);

    return totaldocuments;
  }
  async getTotlaExpiringMembers(branchId) {
    return await memberplan.countDocuments({
      branchId,
      expiryDate: { $lt: new Date() },
    });
  }
}
const dashboardservice = new DashboardService();
export default dashboardservice;
