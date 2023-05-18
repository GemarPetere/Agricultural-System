const mongoose = require("mongoose");
const Farmer = require("../models/Farmer");
const  RecruitFarmer = require("../models/Farmer");
const FarmerCrop = require("../models/FarmerCrops");

exports.search = async (req, res) =>{
    try{
      const { name } = req.params
      const farmers = await Farmer.find({
        $and: [
          {
            $or: [
              { lastName: { $regex: name, $options: 'i' } },
              { firstName: { $regex: name, $options: 'i' } },
            ],
          },
          { activeStatus: true }, // added requirement for activeStatus field
        ]})
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

        const currentYear = new Date().getFullYear();

        const farmers = await Farmer.find({
          $and: [
            { barangay: { $regex: barangay, $options: 'i' } },
            { activeStatus: true }, // added requirement for activeStatus field
          ],
        })
        const searched = []
        for (const farmer of farmers) {
          const cropsDetails = await FarmerCrop.find({ $and:[{farmerId: farmer._id }, {year:currentYear-1}]})
          searched.push({ farmer, cropsDetails })
        }
        return res.status(200).json(searched)
      }catch(error){
        console.log(error)
      }
}

exports.searchCrops = async (req, res) =>{
    try{
        const { crop } = req.params
        const currentYear = new Date().getFullYear();
        const crops = await FarmerCrop.find({$and:[{crop:{$regex:crop, $options:'i'}}, {year:currentYear-1}]})
        const searched = []
        for(const crop of crops){
          const farmer = await Farmer.find({ $and: [
              { _id: crop.farmerId },
              { activeStatus: true }, // added requirement for activeStatus field
            ],
          })
          const farmers = farmer[0]
          searched.push({crop, farmers})
        }
        return res.status(200).json(searched)
      }catch(error){
        console.log(error)
      }
}

exports.searchDataBarangay = async (req, res) =>{
  try{
    const farmers = await Farmer.find()

    let x=0;
    let landAreas=0;
    const response = {}
    farmers.map((farmer) =>{
      if(farmer){
        x++;
        landAreas+=farmer.landArea
      }
    })

    const farmerList = await Farmer.find().sort({ _id: -1 }).limit(10)

    if(farmerList){
      response.farmer = farmerList
      response.farmerCount = x
      response.farmedArea = landAreas
    }
    return res.status(200).json(response)
  }catch(error){
    console.log(error)
    return res.status(500).json(error)
  }
}