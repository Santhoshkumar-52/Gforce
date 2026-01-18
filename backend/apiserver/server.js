import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mainroute from './mainroute.js'


const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================
   HEALTH CHECK
===================== */
app.use('/api', mainroute)


const PORT = process.env.APIPORT;

app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT} 🌐`);
});
