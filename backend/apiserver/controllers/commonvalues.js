import express from "express";
const commonRouter = express.Router()
import axios from "axios";
import dotenv from "dotenv"
import jwt from 'jsonwebtoken'
dotenv.config()
const DBSERVERURL = process.env.DBSERVERURL
const secretekey = process.env.JWT_SECRET_KEY

function converttoken(data) {
    const payload = {
        data
    }
    const token = jwt.sign(payload, secretekey, { expiresIn: '7d' })
    return token
}

commonRouter.post('/planid', async (req, res) => {
    const { branchid, groupid } = req.body;
    if (!branchid || !groupid) {
        return res.status(400).json({ status: "error", message: "branchid and groupid are never received in api request" })
    }
    try {
        const response = await axios.post(`${DBSERVERURL}/db/commonvalue/planid`, { branchid, groupid });
        const planids = converttoken(response.data.planids)
        res.status(200).json({ planids })
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message })
    }
})
commonRouter.post('/gstid', async (req, res) => {
    const { branchid, groupid } = req.body;
    if (!branchid || !groupid) {
        return res.status(400).json({ status: "error", message: "branchid and groupid are never received in api request" })
    }
    try {
        const response = await axios.post(`${DBSERVERURL}/db/commonvalue/gstid`, { branchid, groupid });
        const gstids = converttoken(response.data.gstids)
        res.status(200).json({ gstids })
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message })
    }
})
commonRouter.post('/staffid', async (req, res) => {
    const { branchid, groupid } = req.body;
    if (!branchid || !groupid) {
        return res.status(400).json({ status: "error", message: "branchid and groupid are never received in api request" })
    }
    try {
        const response = await axios.post(`${DBSERVERURL}/db/commonvalue/staffid`, { branchid, groupid });
        const staffids = converttoken(response.data.staffids)
        res.status(200).json({ staffids })
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message })
    }
})
commonRouter.post('/discountid', async (req, res) => {
    const { branchid, groupid } = req.body;
    if (!branchid || !groupid) {
        return res.status(400).json({ status: "error", message: "branchid and groupid are never received in api request" })
    }
    try {
        const response = await axios.post(`${DBSERVERURL}/db/commonvalue/discountid`, { branchid, groupid });
        const discountcategoryid = converttoken(response.data.discountcategoryid)
        res.status(200).json({ discountcategoryid })
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message })
    }
})
commonRouter.post('/clientid', async (req, res) => {
    const {branch} = req.body || "";

    try {
        const response = await axios.post(`${DBSERVERURL}/db/commonvalue/clientid`, { branch });
        const branchid = converttoken(response.data.branchid)
        res.status(200).json({ branchid })
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message })
    }
})




export default commonRouter;