const mongoose = require("mongoose");
const Farmer = require("../models/Farmer");
const  RecruitFarmer = require("../models/Farmer");
const FarmerCrop = require("../models/FarmerCrops");

exports.search = async (req, res) =>{
    try{
        const { fName, lName } = req.params
        await Farmer.find({$and:[{lastName:lName},{firstName:fName}]})
          .then((datas) =>{
            const searched = {}
            const id = datas[0]._id
            FarmerCrop.find({farmerId:id})
                .then((result) =>{
                    searched.farmer = datas[0]
                    searched.cropsDetails = result
                    return res.status(200).json(searched)
                })
          })
          .catch((err) =>{
            console.log(err)
            return res.status(500).json(err)
          })
       
      }catch(error){
        console.log(error)
      }
}

exports.searchBarangay = async (req, res) =>{
    try{
        const { barangay } = req.params
        await Farmer.find({barangay:barangay})
          .then((datas) =>{
            const searched = {}
            const id = datas[0]._id
            FarmerCrop.find({farmerId:id})
                .then((result) =>{
                    searched.farmer = datas[0]
                    searched.cropsDetails = result
                    return res.status(200).json(searched)
                })
          })
          .catch((err) =>{
            console.log(err)
            return res.status(500).json(err)
          })
       
      }catch(error){
        console.log(error)
      }
}

exports.searchCrops = async (req, res) =>{
    try{
        const { crop } = req.params
        await FarmerCrop.find({crop:crop})
          .then((datas) =>{
            // const searched = []
            // const id = datas[0].farmerId
            // Farmer.find({_id:id})
            //     .then((result) =>{
            //         searched.cropDetails = datas[0]
            //         searched.farmer = result
            //         return res.status(200).json(searched)
            //     })
            return res.status(200).json(datas)
          })
          .catch((err) =>{
            console.log(err)
            return res.status(500).json(err)
          })
       
      }catch(error){
        console.log(error)
      }
}