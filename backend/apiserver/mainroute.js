import express from "express";
const router = express.Router();
/* =========================
IMPORT ROUTES
========================= */
import loginrouter from "./controllers/login/login.js";
import memberRouters from "./controllers/member/member.js";


/* =========================
   ROUTE BINDINGS
========================= */
router.use('/login', loginrouter)
router.use('/member', memberRouters)

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
