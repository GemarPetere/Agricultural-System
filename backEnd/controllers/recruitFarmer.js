const mongoose = require("mongoose")
const Farmer = require("../models/Farmer")
const FarmerCrop = require("../models/FarmerCrops")
const cloudinary = require("../helpers/cloudinary");

exports.recruit = async (req, res) =>{
     // TODO: add validation that user has already sent a rating from this order for this product $ne: $message
   try{
    const { 
        firstName, middleName,
        lastName, address,
        gender, birthdate,
        age, status,
        religion, contactNo,
        landArea
    } = req.body
    const { tempFilePath } = req.files.image; 

    if(!firstName || !middleName || 
        !lastName || !address || 
        !gender || !birthdate || 
        !age || !status ||
        !religion || !contactNo ||
        !landArea){
            return res.status(400).json({ error: "One of the data is Undefined"})
        }

    const uploadedResponse = await cloudinary.uploader.upload(tempFilePath, {
        upload_preset: "farmer-image"
    });
     
    const data = {
        firstName:firstName, middleName:middleName,
        lastName:lastName, address:address,
        gender:gender, birthdate:birthdate,
        age:age, status:status,
        religion:religion, contactNo:contactNo,
        landArea:landArea, image: uploadedResponse
    }
    const newRecruit = new Farmer(data);
    newRecruit.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.status(200).json({ data });
    });
   }catch(error){
    console.log(error)
    res.status(500).json({error})
   }
}

exports.farmerCrop = (req, res) => {
    const { crop } = req.body
    const { id } = req.params
    try{
        if(!crop || !id){
            return res.status(400).json({ error: "One of the data is Undefined"})
        }
        const data = {
            crop:crop,
            farmerId: id
        }
        const newCrop = new FarmerCrop(data);
        newCrop.save((err, data) =>{
            if(err){
                return res.status(400).json({
                    error: err
                });
            }
            res.status(200).json({ data });
        })
    }catch(error){
        console.log(error)
        res.status(500).json({error})
    }
}

// exports.farmerImage = async (req, res) =>{
//     try{
//             //image file fetching from request
//             req.body.images = await Promise.all(req.files.map(async (file) =>{
//                 return `${process.env.IMGIX_SUBDOMAIN}/${file.key}`
//             }))
//             console.log(req.body.images[0])
//             Farmer.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)},
//                 {  
//                     "imageUrl":req.body.images[0]
//                 })
//                 .then(function(){
//                     Farmer.findOne({_id:mongoose.Types.ObjectId(req.params.id)})
//                     .then((data) =>{
//                         return res.status(200).send(data);  
//                     })
//                     .catch(err =>{
//                         return res.status(500).json(err)
//                     })
//                 })
//         }catch(error){
//           return error
//         }
//   }

exports.getFarmer = async (req, res) =>{
    try{
        await Farmer.find({})
            .then(data =>{
                return res.status(200).send(data);  
            })
            .catch(err =>{
                return res.status(500).json(err)
            })
    }catch(error){
        console.log(error)
    }
}