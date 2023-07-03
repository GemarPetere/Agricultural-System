const mongoose = require("mongoose");
const Farmer = require("../models/Farmer");
const  RecruitFarmer = require("../models/Farmer");
const FarmerCrop = require("../models/FarmerCrops");
const FarmerAddress = require("../models/Address")

exports.search = async (req, res) =>{
    try{
      const { name, year } = req.params
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
        const cropsDetails = await FarmerCrop.find({ $and:[{farmerId: farmer._id }, {year:year}] })
        searched.push({ farmer, cropsDetails })
      }
      return res.status(200).json(searched)
    }catch(error){
      console.log(error)
    }
}

exports.searchBarangay = async (req, res) =>{
    try{
        const { barangay, year } = req.params

        const farmers = await Farmer.find({
          $and: [
            { barangay: { $regex: barangay, $options: 'i' } },
            { activeStatus: true }, // added requirement for activeStatus field
          ],
        })
        const searched = []
        for (const farmer of farmers) {
          const cropsDetails = await FarmerCrop.find({ $and:[{farmerId: farmer._id }, {year:year}]})
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
        const crops = await FarmerCrop.find({$and:[{crop:{$regex:crop, $options:'i'}}, {year:year}]})
        let prod;
        let farmData = [];
        
        for(let crop in crops){
          prod = crops[crop]
          const farmResponse = await FarmerAddress.find({_id:prod.farmId})
          farmData.push({barangay:farmResponse[0].barangay, production:prod.production})
        }
        return res.status(200).json({farmData})
      }catch(error){
        console.log(error)
      }
}

exports.searchDataBarangay = async (req, res) =>{
  try{
    const farmers = await Farmer.find({activeStatus:true})

    let x=0;
    let landAreas=0;
    const response = {}
    const locations = []

    farmers.map((farmer) =>{
      x++;
      FarmerAddress.find({farmerId:farmer._id})
      .then((responses) =>{
        responses.map((response) =>{
          if(response){
            const lat = response.lat
            const long = response.long

            locations.push({lat, long})
            landAreas+=response.landArea
          }
        })
      })
    })

    const farmerList = await Farmer.find().sort({ _id: -1 }).limit(10)

    if(farmerList){
      response.farmer = farmerList
      response.locations = locations
      response.farmerCount = x
      response.farmedArea = landAreas
    }
    return res.status(200).json(response)
  }catch(error){
    console.log(error)
    return res.status(500).json(error)
  }
}

exports.matiCrops = async (req, res) =>{
  try{
    const { year } = req.params
   await FarmerCrop.find({year:year}, (err, datas) =>{
      if(err){
        return res.status(404).json({
          message:"Data not Found"
        })
      }
      const cropLandAreas = {};
      // Iterate over the data array
      for (let i = 0; i < datas.length; i++) {
        const item = datas[i];
        const crop = item.crop;
        const landArea = item.landArea;

        // Increment the landArea value for the crop in the object
        if (crop in cropLandAreas) {
          cropLandAreas[crop] += landArea;
        } else {
          cropLandAreas[crop] = landArea;
        }
      }

      // Generate the new object with the accumulated landArea for each crop

      return res.status(200).json({
        message:"Data Found",
        body:cropLandAreas
      })
    })

  }catch(error){
    console.log(error)
    return res.status(500).json({
      message:"Server Error",
      body: error
    })
  }
}