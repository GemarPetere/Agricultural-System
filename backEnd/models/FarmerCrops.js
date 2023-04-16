const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const data = {
  farmerId:{
    type:String,
    trim:true,
    ref:'RecruitmentForm'
  },
  crop:{
    type:String,
    trim:true
  }
};
const farmerCrop = new Schema(data, { timestamps: true });

module.exports = mongoose.model("FarmerCrop", farmerCrop);
