import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const attedanceRouter = express.Router();
const DBSERVERURL = process.env.DBSERVERURL;

attedanceRouter.post("/checkin", async (req, res) => {
  console.log("Checking Attendance for Member");

  try {
    const { branchid, memberid } = req.body;
    if (!branchid || !memberid) {
      return res.status(400).json({
        status: "error",
        message: "Branch ID and Member ID never Received for API Server",
      });
    }

    const response = await axios.post(`${DBSERVERURL}/db/attendance/checkin`, {
      branchid,
      memberid,
    });
    res.status(200).json({
      status: response.data.status,
      message: response.data.message,
      result: response.data.result || 0,
    });
  } catch (error) {
    console.error("Error in attendance route:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing attendance data",
    });
  }
});

export default attedanceRouter;
