import express from "express";
const router = express.Router();
/* =========================
IMPORT ROUTES
========================= */
import loginrouter from "./controllers/login/login.js";
import memberRouters from "./controllers/member/member.js";
import commonRouter from "./controllers/commonvalues.js";
import salerouter from "./controllers/sales/managesales.js";


/* =========================
   ROUTE BINDINGS
========================= */
router.use('/login', loginrouter)
router.use('/member', memberRouters)
router.use('/commonvalue', commonRouter)
router.use('/sales', salerouter)

/* =========================
   FALLBACK (OPTIONAL)
========================= */
router.use((req, res) => {
   res.status(404).json({
      status: "error",
      message: "DB route not found"
   });
});

export default router;
