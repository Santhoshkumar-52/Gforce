import activeplans from "../cards/activeplans.js";
import attendancecount from "../cards/attendancecount.js";
import expiredplans from "../cards/expiredplans.js";
import expiringplans from "../cards/expiringplans.js";
import renewals from "../cards/newrenewals.js";
import pendingpayments from "../cards/pendingpayments.js";
import revenue from "../cards/revenue.js";
import totalmembers from "../cards/totalmember.js";

const cardConfigs = [
  {
    title: "Total Members",
    icon: "👥",
    service: totalmembers,
  },
  {
    title: "Active Plans",
    icon: "🏋️",
    service: activeplans,
  },
  {
    title: "Expired Plans",
    icon: "⏰",
    service: expiredplans,
  },
  {
    title: "Expiring in 7 Days",
    icon: "⏳",
    service: expiringplans,
  },
  {
    title: "Total Attendance",
    icon: "📅",
    service: attendancecount,
  },
  {
    title: "Total Revenue",
    icon: "💸",
    service: revenue,
  },
  {
    title: "Pending Payments",
    icon: "⚠️",
    service: pendingpayments,
  },
  {
    title: "New Renewals",
    icon: "🔄",
    service: renewals,
  },
];

const CardService = async (filters) => {
  try {
    const { branchid, startdate, enddate } = filters;

    if (!branchid || !startdate || !enddate) {
      throw new Error("Missing required query parameters");
    }

    const payload = {
      branchid,
      startdate,
      enddate,
    };

    const results = await Promise.all(
      cardConfigs.map(async (card) => {
        try {
          const value = await card.service(payload);

          return {
            title: card.title,
            icon: card.icon,
            value,
          };
        } catch (error) {
          console.error(`[${card.title}] Error`, error);

          return {
            title: card.title,
            icon: card.icon,
            value: 0,
            error: true,
          };
        }
      }),
    );

    return results;
  } catch (err) {
    console.error("[CardService Error]", err);
    throw err;
  }
};

export default CardService;
