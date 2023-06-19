const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const data = {
  farmerId:{
    type:String,
    trim:true,
    ref:'RecruitmentForm'
  },
  addressId:{
    type:String,
    trim:true,
    ref: 'FarmerAddress'
  },
  year:{
    type: String,
    trim:true,
  },
  crop:{
    type:String,
    trim:true
  },
  landArea:{
    type:Number,
    default: 0
  },
  production:{
    type: Number,
    default: 0
  },
  yield:{
    type:Number,
    default: 0
  },
  netIncome:{
    type: Number,
    default: 0
  }
};
const farmerCrop = new Schema(data, { timestamps: true });

module.exports = mongoose.model("FarmerCrop", farmerCrop);
