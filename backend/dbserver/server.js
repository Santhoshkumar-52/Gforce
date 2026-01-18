import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import mainrouter from "./mainroute.js";

dotenv.config();

const app = express();

/* =====================
   MIDDLEWARES
===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/db',mainrouter)

/* =====================
   HEALTH CHECK
===================== */
app.post("/", (req, res) => {
    const { msg } = req.body

    res.json({
        status: "OK",
        service: "DB SERVER",
        msg: `${msg} World`
    })
});

/* =====================
   INTERNAL ROUTES (later)
===================== */
// app.use("/internal/users", userRoutes);
// app.use("/internal/customers", customerRoutes);

/* =====================
   CONNECT DB + START
===================== */
const PORT = process.env.DBPORT

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`DB Server running on port ${PORT} 🔒`);
    });
});
