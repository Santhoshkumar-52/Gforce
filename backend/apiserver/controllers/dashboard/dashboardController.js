import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const dashboardRouter = express.Router()
const DBSERVERURL = process.env.DBSERVERURL
dashboardRouter.post("/charts", (req, res) => {
    const { branchid, fromdate, todate } = req.body;

    if (!branchid || !fromdate || !todate) {
        return res.status(400).json({
            error: "Error",
            message: "Required parameters missing for charts (branchid / fromdate / todate)"
        });
    }

   

});
dashboardRouter.post("/cards", async (req, res) => {
    const { branchid, fromdate, todate } = req.body;

    if (!branchid || !fromdate || !todate) {
        return res.status(400).json({
            error: "Error",
            message: "Required parameters missing for cards (branchid / fromdate / todate)"
        });
    }

    try {
        // call DB server API
        const response = await axios.post(
            `${DBSERVERURL}/db/dashboard/carddata`,
            {
                branchid,
                fromdate,
                todate
            }
        );

        // send DB result directly to frontend
        return res.json(response.data);

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            error: "Error",
            message: "Failed to fetch card data"
        });
    }
});


export default dashboardRouter;
