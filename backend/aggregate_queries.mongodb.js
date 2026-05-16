// for summary bill
db.salemaster.aggregate([
  { $match: { saleUniqueId: "12936356765" } },
  {
    $lookup: {
      from: "memberplan",
      localField: "saleUniqueId",
      foreignField: "saleUniqueId",
      as: "mbp",
    },
  },
  {
    $lookup: {
      from: "planmaster",
      localField: "mbp.planId",
      foreignField: "_id",
      as: "plm",
    },
  },
  {
    $lookup: {
      from: "membermaster",
      localField: "mbp.memberId",
      foreignField: "_id",
      as: "mbm",
    },
  },
  {
    $lookup: {
      from: "staffmaster",
      localField: "mbp.allotedstaff",
      foreignField: "_id",
      as: "stm",
    },
  },
  {
    $lookup: {
      from: "staffmaster",
      localField: "creadtedBy",
      foreignField: "_id",
      as: "sstm",
    },
  },
  {
    $lookup: {
      from: "groupmaster",
      localField: "sstm.groupId",
      foreignField: "_id",
      as: "gpm",
    },
  },
  { $unwind: "$mbp" },
  { $unwind: "$plm" },
  { $unwind: "$mbm" },
  { $unwind: "$sstm" },
  { $unwind: "$stm" },
  { $unwind: "$gpm" },
  {
    $project: {
      // PLAN
      plan_name: "$plm.plan_name",

      // MEMBER
      membername: {
        $concat: ["$mbm.firstname", " ", "$mbm.lastname"],
      },
      memberid: "$mbm.customerId",

      // STAFF
      allotedstaff: "$stm.fullName",
      createdStaff: "$sstm.fullName",
      createdStaffGorup: "$gpm.groupName",

      // SALEMASTER (remaining)
      billno: 1,
      saleDate: 1,
      baseAmount: 1,
      discountAmount: 1,
      gstAmount: 1,
      nettAmount: 1,
      paidAmount: 1,
      balance: 1,
      paymentMode: 1,
      status: 1,

      // MEMBERPLAN (remaining)
      startDate: "$mbp.startDate",
      expiryDate: "$mbp.expiryDate",
      isActive: "$mbp.isActive",
      isExpired: "$mbp.isExpired",
      cancelled: "$mbp.cancelled",

      _id: 0,
    },
  },
]);

// member attendance

db.membermaster.aggregate([
  {
    $match: {
      _id: ObjectId("69912ecbcb06e45c837cacf7"),
      branchId: ObjectId("6969e6fc89c79021fb7b28f3"),
    },
  },
  {
    $lookup: {
      from: "memberplan",
      localField: "_id",
      foreignField: "memberId",
      as: "mbp",
    },
    $sort: {
      _id: -1,
    },
  },
]);

// getting staff details with branch id
db.staffmaster.aggregate([
  {
    $match: {
      branchId: new ObjectId(branchid),
    },
  },
  {
    $lookup: {
      from: "groupmaster",
      localField: "groupId",
      foreignField: "_id",
      as: "groupDetails",
    },
  },
  {
    $project: {
      _id: 1,
      fullName: 1,
      staffid: 1,
      phone: 1,
      activeStatus: 1,
      mobile: 1,
      groupName: { $arrayElemAt: ["$groupDetails.groupName", 0] },
    },
  },
]);

// reports
// salereport
await salemaster
  .find({
    branchId: new mongoose.Types.ObjectId(branchid),
    saleDate: { $gte: startDate, $lte: endDate },
  })
  .select(
    "billno saleDate saleType nettAmount paidAmount paymentMode status saleUniqueId",
  )
  .sort({ saleDate: -1 });

//m_attendance
db.m_attendanceLog.aggregate([
  {
    $lookup: {
      from: "membermaster", // collection name to join
      localField: "memberId", // field in attendance
      foreignField: "_id", // field in members
      as: "memberInfo", // joined result
    },
  },
  {
    $unwind: "$memberInfo", // convert array to object
  },
  {
    $project: {
      "memberInfo.firstname": 1,
      "memberInfo.customerId": 1,
      checkIn: 1,
      checkOut: 1,
      durationMinutes: 1,
      status: 1,
      autoEnd: 1,
      autoEndReason: 1,
      attendanceDate: 1,
      source: 1,
    },
  },
]);
