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
  landArea:{
    type:Number,
    default:0
  },
  image:{
    type:Object,
    default:{}
  },
  landOwnershipStatus:{
    type:String,
    trim:true
  },
  lat:{
    type:String,
    default:"6.951944838057917"
  },
  long:{
    type:String,
    default:"126.21625900268556"
  }
};
const userSchema = new Schema(data, { timestamps: true });

module.exports = mongoose.model("RecruitFarmer", userSchema);
