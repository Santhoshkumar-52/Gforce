import express from "express";
import loginrouter from "./controllers/logincontrol.js/login.js";
import memberRouter from "./controllers/membercontrol.js/member.js";
import commonRouter from "./controllers/commonvalue/commonvalue.js";
import salerouter from "./controllers/salecontrol/salecontrol.js";
import dashboardRouter from "./controllers/dashboard/dashboard.js";
import attedanceRouter from "./controllers/attendance/attendance.js";
const mainrouter = express.Router();

mainrouter.use("/logincontrol", loginrouter);
mainrouter.use("/membercontrol", memberRouter);
mainrouter.use("/commonvalue", commonRouter);
mainrouter.use("/sales", salerouter);
mainrouter.use("/dashboard", dashboardRouter);
mainrouter.use("/attendance", attedanceRouter);

export default mainrouter;
