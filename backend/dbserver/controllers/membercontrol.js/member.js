import express from 'express'
import Membermaster from '../../model/customermaster.js'

const memberRouter = express.Router()

memberRouter.post('/', async (req, res) => {
    const { clientid } = req.body;
    console.log("cleint id received: ", clientid);

    const records = clientid == 'all' ? await Membermaster.find({}) : await Membermaster.find({ branchId: clientid });

    if (records.length < 1 || !records) {
        return res.status(200).json({ message: 'No records found' });
    }
    return res.status(200).json({ records });

})
memberRouter.post('/addmember', async (req, res) => {
    const {
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
        branchid
    } = req.body;

    // checking duplicate mobile or email
    const duplicateCheck = await Membermaster.findOne({
        $or: [
            { mobile: mobile },
            { email: email },
            { customerId: memberid }
        ]
    });
    if (duplicateCheck) {
        return res.status(200).json({
            status: "error",
            message: "Member Id or Mobile or Email already exists",
            title: "Duplicate Entry"
        })
    }
    await Membermaster.create({
        customerId: memberid,
        firstname,
        lastname,
        gender,
        branchId: branchid, // mongoose will cast to ObjectId
        dob: dob ? new Date(dob) : undefined,
        marital_status,
        mobile,
        alternate_mobile,
        email,
        address_line1,
        address_line2,
        area,
        city,
        pincode
    });
    return res.status(201).json({
        status: "success",
        message: "Member inserted successfully",
        title: "Success"
    });



})
memberRouter.get("/getdetails", async (req, res) => {
    try {
        let { memberid } = req.query;
        memberid = Number(memberid);

        const result = await Membermaster.find({
            customerId: memberid
        });

        if (result.length === 0) {
            return res.status(204).json({ message: "No records found" });
        }

        console.log("Member details fetched from Db for Id:", memberid);
        return res.status(202).json({ result });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err });
    }
})

export default memberRouter
