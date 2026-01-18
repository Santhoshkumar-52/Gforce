import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    branchname: {
        type: String,
        required: true,
        unique: true
    },
    brancuniqueid: {
        type: Number,
        unique: true
    },
    address: String,
    mobile: Number,
    GSTNo: String,
    OwnershipType: {
        type: String,
        enum: ["Owned", "Rented", "Leased"],
        default: "Owned"
    },

    activeStatus: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Branchmaster", branchSchema, "branchmaster");
