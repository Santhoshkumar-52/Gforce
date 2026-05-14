import salechartreport from "../charts/saleChart.js";

const ChartService = async (filters) => {
  try {
    const { branchid, startdate, enddate } = filters;

    if (!branchid || !startdate || !enddate) {
      throw new Error("Missing required query parameters");
    }

    const [salereport] = await Promise.all([salechartreport(filters)]);

    return {
      salereport,
    };
  } catch (err) {
    console.error("[ChartService Error]", err);

    throw err;
  }
};

export default ChartService;
