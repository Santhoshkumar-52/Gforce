import activeplans from "../cards/activeplans.js";
import attendancecount from "../cards/attendancecount.js";
import pendingpayments from "../cards/pendingpayments.js";
import totalmembers from "../cards/totalmember.js";
const CardService = async (filters) => {
  try {
    const { branchid, startdate, enddate } = filters;

    if (!branchid || !startdate || !enddate) {
      throw new Error("Missing required query parameters");
    }
    const totalMembers = await totalmembers({ branchid, startdate, enddate });
    const totalactiveplans = await activeplans({ branchid, startdate, enddate });
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

    return [
      {
        title: "Total Members",
        value: totalMembers,
        icon: "👥",
      },
      {
        title: "Active Plans",
        value: totalactiveplans,
        icon: "🏋️",
      },
      {
        title: "Pending Payments",
        value: totalpending,
        icon: "⚠️",
      },
      {
        title: "Total Attendance",
        value: totalattendance,
        icon: "📅",
      },
    ];
  } catch (err) {
    console.error("[CardService Error]", err);

    throw err;
  }
};

export default CardService;
