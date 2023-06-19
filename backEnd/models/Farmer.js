const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const data = {
  firstName: {
    type: String,
    trim: true
  },
  referenceControlNum:{
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
  email:{
    type: String,
    trim: true
  },
  highestEducation:{
    type: String,
    trim: true
  },
  image:{
    type:Object,
    default:{}
  },
  landOwnershipStatus:{
    type:String,
    trim:true
  },
  activeStatus:{
    type: Boolean,
    default: true
  }
};
const userSchema = new Schema(data, { timestamps: true });

module.exports = mongoose.model("RecruitFarmer", userSchema);
