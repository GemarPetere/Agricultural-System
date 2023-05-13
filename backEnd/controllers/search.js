const mongoose = require("mongoose");
const Farmer = require("../models/Farmer");
const  RecruitFarmer = require("../models/Farmer");
const FarmerCrop = require("../models/FarmerCrops");

exports.search = async (req, res) =>{
    try{
      const { name } = req.params
      const farmers = await Farmer.find({$or:[{lastName:name},{firstName:name}]})
      const searched = []
      for (const farmer of farmers) {
        const cropsDetails = await FarmerCrop.find({ farmerId: farmer._id })
        searched.push({ farmer, cropsDetails })
      }
      return res.status(200).json(searched)
    }catch(error){
      console.log(error)
    }
}

exports.searchBarangay = async (req, res) =>{
    try{
        const { barangay } = req.params
        const farmers = await Farmer.find({barangay:barangay})
        const searched = []
        for (const farmer of farmers) {
          const cropsDetails = await FarmerCrop.find({ farmerId: farmer._id })
          searched.push({ farmer, cropsDetails })
        }
        return res.status(200).json(searched)
      }catch(error){
        console.log(error)
      }
}

exports.searchCrops = async (req, res) =>{
    try{
        const { crop, year } = req.params
        const crops = await FarmerCrop.find({$and:[{crop:crop}, {year:year}]})
        const searched = []
        for(const crop of crops){
          const farmer = await Farmer.find({_id: crop.farmerId})
          searched.push({crop, farmer})
        }
        return res.status(200).json(searched)
      }catch(error){
        console.log(error)
      }
}