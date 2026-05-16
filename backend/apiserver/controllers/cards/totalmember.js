import mongoose from "mongoose";
import Membermaster from "../../model/customermaster.js";

const totalmembers = async ({ branchid, enddate }) => {
  if (!branchid || !enddate) {
    throw new Error("Missing required query parameters");
  }

  // 📅 End of selected day
  const end = new Date(enddate);
  end.setHours(23, 59, 59, 999);

  // ✅ Total members AS OF selected date
  const result = await Membermaster.countDocuments({
    branchId: new mongoose.Types.ObjectId(branchid),

    joined_date: {
      $lte: end,
    },

    isactive: true,
  });

  return result;
};

export default totalmembers;
