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
