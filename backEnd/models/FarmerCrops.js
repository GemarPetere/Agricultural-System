const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const data = {
  farmerId:{
    type:String,
    trim:true,
    ref:'RecruitmentForm'
  },
  year:{
    type: String,
    trim:true,
  },
  crop:{
    type:String,
    trim:true
  },
  cropArea:{
    type: Number,
    default:0
  },
  landArea:{
    type:Number,
    default: 0
  },
  yield:{
    type:Number,
    default: 0
  }
};
const farmerCrop = new Schema(data, { timestamps: true });

module.exports = mongoose.model("FarmerCrop", farmerCrop);
