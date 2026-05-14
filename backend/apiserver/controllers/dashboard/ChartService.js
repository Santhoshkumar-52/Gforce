import salechartreport from "../charts/saleChart.js";
import memberChart from "../charts/memberChart.js";
import mattendanceChart from "../charts/mattendanceChart.js";

const ChartService = async (filters) => {
  try {
    const { branchid, startdate, enddate } = filters;

    if (!branchid || !startdate || !enddate) {
      throw new Error("Missing required query parameters");
    }

    const [salereport, membershipcount, mattendance] = await Promise.all([
      salechartreport(filters),
      memberChart(filters),
      mattendanceChart(filters),
    ]);

    return {
      salereport,
      membershipcount,
      mattendance,
    };
  } catch (err) {
    console.error("[ChartService Error]", err);

    throw err;
  }
};

export default ChartService;
