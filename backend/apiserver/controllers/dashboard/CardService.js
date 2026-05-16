import activeplans from "../cards/activeplans.js";
import attendancecount from "../cards/attendancecount.js";
import expiredplans from "../cards/expiredplans.js";
import expiringplans from "../cards/expiringplans.js";
import renewals from "../cards/newrenewals.js";
import pendingpayments from "../cards/pendingpayments.js";
import revenue from "../cards/revenue.js";
import totalmembers from "../cards/totalmember.js";
const CardService = async (filters) => {
  try {
    const { branchid, startdate, enddate } = filters;

    if (!branchid || !startdate || !enddate) {
      throw new Error("Missing required query parameters");
    }
    const totalMembers = await totalmembers({ branchid, startdate, enddate });
    const totalactiveplans = await activeplans({ branchid, startdate, enddate });
    const totalexpiring = await expiringplans({
      branchid,
      startdate,
      enddate,
    });
    const totalpending = await pendingpayments({
      branchid,
      startdate,
      enddate,
    });
    const totalattendance = await attendancecount({
      branchid,
      startdate,
      enddate,
    });
    const totalexpired = await expiredplans({
      branchid,
      startdate,
      enddate,
    });
    const totalRevenue = await revenue({
      branchid,
      startdate,
      enddate,
    });
    const newrenewals = await renewals({
      branchid,
      startdate,
      enddate,
    });

    return [
      {
        title: "Total Members",
        value: totalMembers,
        icon: "",
      },
      {
        title: "Active Plans",
        value: totalactiveplans,
        icon: "🏋️",
      },
      {
        title: "Expired Plans",
        value: totalexpired,
        icon: "⏰",
      },
      {
        title: "Expiring in 7 Days",
        value: totalexpiring,
        icon: "⏳",
      },
      {
        title: "Total Attendance",
        value: totalattendance,
        icon: "📅",
      },
      {
        title: "Total Revenue",
        value: totalRevenue,
        icon: "💸",
      },
      {
        title: "Pending Payments",
        value: totalpending,
        icon: "⚠️",
      },
      {
        title: "New Renewals",
        value: newrenewals,
        icon: "🔄",
      },
    ];
  } catch (err) {
    console.error("[CardService Error]", err);

    throw err;
  }
};

export default CardService;
