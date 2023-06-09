const mongoose = require("mongoose");
const Farmer = require("../models/Farmer");
const FarmerCrop = require("../models/FarmerCrops");
const cloudinary = require("../helpers/cloudinary");
const FarmerAddress = require("../models/Address")

exports.recruit = async (req, res) => {
  // TODO: add validation that user has already sent a rating from this order for this product $ne: $message
  try {
    const {
      farmerId,
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

    // if (
    //   address ||
    //   !gender ||
    //   !birthDate ||
    //   !age ||
    //!status ||
    //   !religion ||
    //   !contactNo ||
    //   !landArea
    // ) {
    //   return res.status(400).json({ error: "One of the data is Undefined" });
    // }

 
    const farmerFound = await Farmer.find({_id:farmerId})
    
    if(farmerFound.length > 0){
      const addressData = {
        address: address,
        barangay: barangay,
        landArea:landArea,
        farmerId: farmerId,
        lat:lat,
        long:long
      }
      
      const newAddress = new FarmerAddress(addressData);
        const saveNewAddress = await newAddress.save();
        if(saveNewAddress){
          res.status(200).json({
            message: "Saved Farmer",
            body: saveNewAddress
          })
        }
    }else{
      const data = {
        firstName: firstName,
        referenceControlNum: referenceControlNum,
        middleName: middleName,
        lastName: lastName,
        suffix: suffix,
        gender: gender,
        birthdate: birthDate,
        age: age,
        status: status,
        religion: religion,
        contactNo: contactNo,
        email: email,
        highestEducation: highestEducation,
        landOwnershipStatus: landOwnershipStatus
      };
      const newRecruit = new Farmer(data);
      const saveNewFarmer = await newRecruit.save();
      if(saveNewFarmer){
        const dataAddress ={
          address: address,
          barangay: barangay,
          landArea:landArea,
          farmerId: saveNewFarmer._id,
          lat:lat,
          long:long
        }

        const newAddress = new FarmerAddress(dataAddress);
        const saveNewAddress = await newAddress.save();
        if(saveNewAddress){
          res.status(200).json({
            message: "Saved New Farmer",
            body: {saveNewFarmer,saveNewAddress}
          })
        }
      }
    }
    
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

exports.farmerCrop = async (req, res) => {
  const { crop, year, landArea, production, yield , netIncome, farmId } = req.body;
  const { id } = req.params;
  try {
    
    if (!crop || !id) {
      return res.status(400).json({ error: "One of the data is Undefined" });
    }

    const farmerData = await FarmerAddress.find({_id:farmId})
    if(farmerData.length > 0 ){
      const landarea = farmerData[0].landArea
      if(landarea < landArea){
        return res.status(400).json({ error: "Invalid Input, Reached the limit" });
      }
    }
    
    FarmerCrop.findOne({
      $and:[
        {crop:crop},
        {year:year},
        {farmerId:id},
        {farmId:farmId}
      ]
    }).then((data) =>{
      if(data){
       
        const dataCrop = {
          $inc:{
            landArea: landArea,
            netIncome: netIncome,
            production:production,
            yield: yield
          }
        }
        FarmerCrop.findOneAndUpdate({farmerId:id}, dataCrop )
          .then((result) =>{
            return res.status(200).json({result})
          })
          .catch((error) => {
            return res.status(500).json({ error: 'An error occurred while updating the document.' });
          });
      }else{
        const data = {
          crop: crop,
          year: year,
          landArea: landArea,
          production: production,
          yield:yield,
          netIncome: netIncome,
          farmerId: id,
          farmId: farmId
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
      }
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.farmerCropDetails = async (req, res) =>{
  try{
    const { year, id, farmId } = req.params;
    if(!year || !id){
      return res.status(400).json(
        { error: "One of the data is Undefined" }
      );
    }
    const query = {
      $and:[
        {"year": year},
        {"farmerId": id},
        {"farmId": farmId}
      ]
    }
    const result = await FarmerCrop.find(query)
    if(result.length < 1){
      res.status(404).json({
        error: "Empty Data",
      }); 
    }
    // if(!result[0].farmId){
    //   return res.status(404).json({
    //     error: "Check DB something missing farmId",
    //   }); 
    // }
    res.status(200).json({result});
  }catch(error){
    res.status(500).json({error})
  }
}

exports.getFarmerList = async (req, res) => {
  try {
    await Farmer.find()
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
          const activeStatus = data.activeStatus

          Data = {Name, Age, Status, Contact, id, image, activeStatus}

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
    let result = {}
    const data = await Farmer.find({_id:id})
    if(data.length > 0){
      result.farmer = data

      const farmData = await FarmerAddress.find({farmerId:data[0]._id})
      if(farmData.length > 0){
        result.farm = farmData
      }
      const cropDatas = await FarmerCrop.find({farmerId:data[0]._id})
      if(cropDatas.length > 0){
        let cropYear = []
        cropDatas.forEach((cropData) =>{
          if(!cropYear.includes(cropData)){
            cropYear.push(cropData.year)
          }
        })
        result.crop = cropYear
      }
      return res.status(200).json(result)
    }else{
      return res.status(404).json(err)
    }
     
  }catch(error){
   //console.log(error)
    return res.status(500).json(err)
  }
}

// exports.getFarmerCrops = async (req, res) =>{
//   try{
//     const { id } = req.params
//     await FarmerCrop.find({farmerId: id})
//         .then((result)=>{
//           return res.status(200).json(result)
//         })
//       .catch((err) =>{
//         return res.status(500).json(err)
//       })
//   }catch(error){
//     console.log(error)
//   }
// }


//By category of Barnagay to get the crops registered of Farmer
exports.getFarmerCrops = (req, res) =>{
  try{
    const {farmerId, farmId } = req.params
    
    FarmerCrop.find({$and:[{farmerId: farmerId},{farmId: farmId}]})
      .then((result) =>{
        if(result){
          return res.status(200).json(result)
        }
      })
      .catch((err) =>{
        return res.status(500).json(err)
      })

  }catch(error){
    console.log(error)
    res.status(500).json(error)
  }
}

exports.putActiveStatus = async (req, res) =>{
  try{
    const { id } = req.params
    const { action } = req.body
    await Farmer.updateOne({_id: id}, {$set:{activeStatus: action}})
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