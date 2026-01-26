import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config()

const memberRouters = express.Router()
const DBSERVERURL = process.env.DBSERVERURL

memberRouters.post('/getmembers', async (req, res) => {
    const { clientid } = req.body;

    if (!clientid) {
        return res.status(400).json({ message: "branchid is not specified" });
    }

    try {
        const response = await axios.post(`${DBSERVERURL}/db/membercontrol`, { clientid });
        res.status(200).json(response.data);
    } catch (err) {
        console.error("Error connecting to DB Server:", err.message);
        return res.status(502).json({
            status: "error",
            message: "Something went wrong while connecting to DB Server",
            title: "Server Error"
        });
    }
});
memberRouters.post('/addmember', async (req, res) => {
    let {
        memberid,
        firstname,
        lastname,
        gender,
        dob,
        marital_status,
        mobile,
        alternate_mobile,
        email,
        address_line1,
        address_line2,
        area,
        city,
        pincode,
        clientid
    } = req.body;
    if (!gender || !dob || !mobile || !address_line1 || !area) {
        return res.status(200).json({
            status: "error",
            message: "Required fields are missing",
            title: "Validation Error"
        })
    }
    if (mobile == alternate_mobile) {
        return res.status(200).json({
            status: "error",
            message: "Mobile and Alternate mobile cannot be same",
            title: "Validation Error"
        })
    }
    if (memberid.length == 0) {
        memberid = Math.floor(1000 + Math.random() * 8500);
    }

    try {
        const response = await axios.post(`${DBSERVERURL}/db/membercontrol/addmember`, {
            memberid,
            firstname,
            lastname,
            gender,
            dob,
            marital_status,
            mobile,
            alternate_mobile,
            email,
            address_line1,
            address_line2,
            area,
            city,
            pincode,
            branchid: clientid
        });
        const data = response.data;
        res.status(200).json({
            status: data.status,
            text: data.message,
            title: data.title
        });

    } catch (err) {
        console.error("Error connecting to DB Server:", err.message);
        return res.status(502).json({
            status: "error",
            message: "Something went wrong while connecting to DB Server",
            title: "Server Error"
        });
    }
});
memberRouters.get('/getdetails', async (req, res) => {
    const { memberid } = req.query;

    if (!memberid) {
        return res.status(400).json({ message: "Memberid is not specified" });
    }
    console.log("API: Getting member Details for Id:", memberid);

    try {
        const response = await axios.get(`${DBSERVERURL}/db/membercontrol/getdetails`, { params: { memberid } });
        if (response.status === 204) {
            return res.status(204).json({ message: "No records found" });
        }
        res.status(202).json(response.data);
    } catch (err) {
        console.error("Error connecting to DB Server:", err.message);
        return res.status(502).json({
            status: "error",
            message: "Something went wrong while connecting to DB Server",
            title: "Server Error"
        });
    }
});
memberRouters.patch('/updatemember', async (req, res) => {
    let {
        memberid,
        firstname,
        lastname,
        gender,
        dob,
        marital_status,
        mobile,
        alternate_mobile,
        email,
        address_line1,
        address_line2,
        area,
        city,
        pincode,
        isactive
    } = req.body;
    const values = {
        memberid,
        firstname,
        lastname,
        gender,
        dob,
        marital_status,
        mobile,
        alternate_mobile,
        email,
        address_line1,
        address_line2,
        area,
        city,
        pincode,
        isactive
    }

    if (!gender || !dob || !mobile || !address_line1 || !area) {
        return res.status(204).json({
            status: "error",
            message: "Required fields are missing",
            title: "Validation Error"
        })
    }
    if (mobile == alternate_mobile) {
        return res.status(200).json({
            status: "error",
            message: "Mobile and Alternate mobile cannot be same",
            title: "Validation Error"
        })
    }
    // if (memberid.length == 0) {
    //     memberid = Math.floor(1000 + Math.random() * 8500);
    // }

    try {
        console.log("Sending Updated Record to Db");

        const response = await axios.patch(`${DBSERVERURL}/db/membercontrol/updatemember`, values);
        const data = response.data;
        res.status(200).json({
            status: data.status,
            text: data.message,
            title: data.title
        });

    } catch (err) {
        console.error("Error connecting to DB Server:", err.message);
        return res.status(502).json({
            status: "error",
            message: "Something went wrong while connecting to DB Server",
            title: "Server Error"
        });
    }
});

export default memberRouters
