import express from "express";
import dotenv from "dotenv";
import Membermaster from "../../model/customermaster.js";

dotenv.config();

const memberRouters = express.Router();

memberRouters.post("/getmembers", async (req, res) => {
  const { clientid } = req.body;

  if (!clientid) {
    return res.status(400).json({ message: "branchid is not specified" });
  }

  try {
    const records =
      clientid == "all"
        ? await Membermaster.find({})
        : await Membermaster.find({ branchId: clientid });

    if (records.length < 1 || !records) {
      return res.status(200).json({ message: "No records found" });
    }
    console.log("Records found: ", records.length);
    return res.status(200).json({ records });
  } catch (err) {
    console.error("Error connecting to DB Server:", err.message);
    return res.status(502).json({
      status: "error",
      message: "Something went wrong while connecting to DB Server",
      title: "Server Error",
    });
  }
});
memberRouters.post("/addmember", async (req, res) => {
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
    clientid,
  } = req.body;
  if (!gender || !dob || !mobile || !address_line1 || !area) {
    return res.status(200).json({
      status: "error",
      message: "Required fields are missing",
      title: "Validation Error",
    });
  }
  if (mobile == alternate_mobile) {
    return res.status(200).json({
      status: "error",
      message: "Mobile and Alternate mobile cannot be same",
      title: "Validation Error",
    });
  }
  if (memberid.length == 0) {
    memberid = Math.floor(1000 + Math.random() * 8500);
  }

  try {
    const duplicateCheck = await Membermaster.findOne({
      $or: [{ mobile: mobile }, { email: email }, { customerId: memberid }],
    });
    if (duplicateCheck) {
      return res.status(200).json({
        status: "error",
        message: "Member Id or Mobile or Email already exists",
        title: "Duplicate Entry",
      });
    }
    await Membermaster.create({
      customerId: memberid,
      firstname,
      lastname,
      gender,
      branchId: clientid, // mongoose will cast to ObjectId
      dob: dob ? new Date(dob) : undefined,
      marital_status,
      mobile,
      alternate_mobile,
      email,
      address_line1,
      address_line2,
      area,
      city,
      pincode,
    });
    console.log("New member inserted with Id: ", memberid);

    return res.status(201).json({
      status: "success",
      message: "Member inserted successfully",
      title: "Success",
    });
  } catch (err) {
    console.error("Error connecting to DB Server:", err.message);
    return res.status(502).json({
      status: "error",
      message: "Something went wrong while connecting to DB Server",
      title: "Server Error",
    });
  }
});
memberRouters.get("/getdetails", async (req, res) => {
  let { memberid } = req.query;

  if (!memberid) {
    return res.status(400).json({ message: "Memberid is not specified" });
  }
  console.log("API: Getting member Details for Id:", memberid);

  try {
    memberid = Number(memberid);

    const result = await Membermaster.find({
      customerId: memberid,
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
});
memberRouters.patch("/updatemember", async (req, res) => {
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
    isactive,
  } = req.body;
  const updatedData = {
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
    isactive,
  };

  if (
    !memberid ||
    !firstname ||
    !lastname ||
    !mobile ||
    !email ||
    !address_line1 ||
    !city ||
    !pincode ||
    isactive === undefined
  ) {
    return res.status(204).json({
      status: "error",
      message: "Required fields are missing",
      title: "Validation Error",
    });
  }
  if (mobile == alternate_mobile) {
    return res.status(200).json({
      status: "error",
      message: "Mobile and Alternate mobile cannot be same",
      title: "Validation Error",
    });
  }

  try {
    const updatedData = {
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
      isactive,
    };
    const result = await Membermaster.updateOne(
      { customerId: memberid },
      {
        $set: updatedData,
      },
      { runValidators: true, new: true },
    );
    if (!result) {
      return res.status(500).json({
        status: "error",
        message: "Failed to update member details",
        title: "Server Error",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Member details updated successfully",
      title: "Success",
    });
  } catch (err) {
    console.error("Error connecting to DB Server:", err.message);
    return res.status(502).json({
      status: "error",
      message: "Something went wrong while connecting to DB Server",
      title: "Server Error",
    });
  }
});

export default memberRouters;
