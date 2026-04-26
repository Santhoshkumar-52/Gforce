import express from "express";
const router = express.Router();
/* =========================
IMPORT ROUTES
========================= */
import loginrouter from "./controllers/login/login.js";
import memberRouters from "./controllers/member/member.js";
import commonRouter from "./controllers/commonvalues.js";
import salerouter from "./controllers/sales/managesales.js";
import attedanceRouter from "./controllers/attendance/memberAttedanceContr.js";
import staffRouter from "./controllers/staff/staffController.js";
import salerepRouter from "./controllers/reports/salereport.js";
import attRepRouter from "./controllers/reports/attendanceReport.js";

/* =========================
   ROUTE BINDINGS
========================= */
router.use("/login", loginrouter);
router.use("/member", memberRouters);
router.use("/commonvalue", commonRouter);
router.use("/sales", salerouter);
router.use("/attendance", attedanceRouter);
router.use("/staff", staffRouter);

// reports
router.use("/reports/salereport", salerepRouter);
router.use("/reports/attendance", attRepRouter);

/* =========================
   FALLBACK (OPTIONAL)
========================= */
router.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "DB route not found",
  });
});

export default router;
