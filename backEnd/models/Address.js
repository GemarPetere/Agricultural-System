const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const data = {
    farmerId:{
        type: String,
        trim: true,
        ref:'RecruitFarmer'
    },
    address: {
        type: String,
        trim: true,
    },
    barangay:{
        type: String,
        trim: true
    },
    municipalCode:{
        type: String,
        trim: true
    },
    landArea:{
        type:Number,
        default:0
    }
};
const userSchema = new Schema(data, { timestamps: true });

module.exports = mongoose.model("FarmerAddress", userSchema);
