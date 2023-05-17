const mongoose = require("mongoose");
const Farmer = require("../models/Farmer");
const FarmerCrop = require("../models/FarmerCrops");
const cloudinary = require("../helpers/cloudinary");

exports.recruit = async (req, res) => {
  // TODO: add validation that user has already sent a rating from this order for this product $ne: $message
  try {
    const {
      firstName,
      referenceControlNum,
      middleName,
      lastName,
      suffix,
      address,
      barangay,
      municipalCode,
      gender,
      birthDate,
      age,
      status,
      religion,
      contactNo,
      email,
      highestEducation,
      landOwnershipStatus,
      landArea,
      lat,
      long
    } = req.body;

    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !address ||
      !gender ||
      !birthDate ||
      !age ||
      !status ||
      !religion ||
      !contactNo ||
      !landArea ||
      !lat ||
      !long
    ) {
      return res.status(400).json({ error: "One of the data is Undefined" });
    }

    /*  const uploadedResponse = await cloudinary.uploader.upload(tempFilePath, {
      upload_preset: "farmer-image",
    });
 */
    const data = {
      firstName: firstName,
      referenceControlNum: referenceControlNum,
      middleName: middleName,
      lastName: lastName,
      suffix: suffix,
      address: address,
      barangay: barangay,
      municipalCode:municipalCode,
      gender: gender,
      birthdate: birthDate,
      age: age,
      status: status,
      religion: religion,
      contactNo: contactNo,
      email: email,
      highestEducation: highestEducation,
      landOwnershipStatus: landOwnershipStatus,
      landArea: landArea,
      lat:lat,
      long:long
      //image: uploadedResponse,
    };
    const newRecruit = new Farmer(data);
    newRecruit.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.status(200).json({ data });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.farmerImage = async (req, res) => {
  console.log(req.body);
  try {
    const { tempFilePath } = req.files.image;
    const { id } = req.params

    const uploadedResponse = await cloudinary.uploader.upload(tempFilePath, {
      upload_preset: "farmer-image",
    });

    console.log(req.params)
    Farmer.updateOne(
      { _id: id },
      { $set: { "image": uploadedResponse } },
      (error, docs) => {
        if (error) {
          return res.status(400).json({
            error: err,
          });
        }
        if (docs) {
          return res.status(200).json({
            message: "Image Uploaded",
            body: docs,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.farmerCrop = (req, res) => {
  const { crop, year, landArea, production, yield , netIncome } = req.body;
  const { id } = req.params;
  try {
    if (!crop || !id) {
      return res.status(400).json({ error: "One of the data is Undefined" });
    }
    const data = {
      crop: crop,
      year: year,
      landArea: landArea,
      production: production,
      yield:yield,
      netIncome: netIncome,
      farmerId: id,
    };
    const newCrop = new FarmerCrop(data);
    newCrop.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.status(200).json({ data });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.farmerCropDetails = async (req, res) =>{
  try{
    const { year, id } = req.params;
    if(!year || !id){
      return res.status(400).json(
        { error: "One of the data is Undefined" }
      );
    }
    const query = {
      $and:[
        {"year": year},
        {"farmerId": id}
      ]
    }
    const result = await FarmerCrop.find(query)
    if(!result){
      return res.status(404).json({
        error: err,
      }); 
    }
    res.status(200).json({ result });
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

exports.getFarmerList = async (req, res) => {
  try {
    await Farmer.find({})
      .then((datas) => {
        let resData = []
        let Data = {}
        datas.map(data =>{
          const Name = `${data.firstName} ${data.lastName}`
          const Age = data.age
          const Status = data.status
          const Contact = data.contactNo
          const id = data._id
          const image = data.image.url

          Data = {Name, Age, Status, Contact, id, image}

          resData.push(Data)

        })
        return res.status(200).send(resData);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  } catch (error) {
    console.log(error);
  }
};

exports.getFarmerDetails = async (req, res) =>{
  try{
    const { id } = req.params
    await Farmer.find({_id:id})
      .then((data) =>{
        return res.status(200).json(data)
      })
      .catch((err) =>{
        return res.status(500).json(err)
      })
  }catch(error){
    console.log(error)
  }
}

exports.getFarmerCrops = async (req, res) =>{
  try{
    const { id } = req.params
    await FarmerCrop.find({farmerId: id})
        .then((result)=>{
          return res.status(200).json(result)
        })
      .catch((err) =>{
        return res.status(500).json(err)
      })
  }catch(error){
    console.log(error)
  }
}

exports.putActiveStatus = async (req, res) =>{
  try{
    const { id } = req.params
    const { action } = req.body
    await Farmer.findOneAndUpdate({_id: id}, {$set:{activeStatus: action}})
          .then(function(){
            Farmer.find({_id:id})
              .then(data =>{
                if(data){
                  let response = {}
                  response.activeStatus = data[0].activeStatus
                  response.message = "Successfully Update Status"
                  return res.status(200).json(response)
                }
              })
          })
          .catch(error =>{
            return res.status(500).json(error)
          })
  }catch(error){
    console.log(error)
  }
}