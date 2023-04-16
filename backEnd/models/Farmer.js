const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const data = {
  firstName: {
    type: String,
    trim: true
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim:true
  },
  suffix: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
  },
  birthdate: {
    type: String,
    trim: true,
  },
  age:{
    type:String,
    trim:true
  },
  status:{
    type:String,
    trim:true
  },
  religion:{
    type:String,
    trim:true
  },
  contactNo:{
    type:String,
    trim:true
  },
  landArea:{
    type:String,
    trim:true
  },
  image:{
    type:Object,
    required: true
  }
};
const userSchema = new Schema(data, { timestamps: true });

module.exports = mongoose.model("RecruitFarmer", userSchema);
