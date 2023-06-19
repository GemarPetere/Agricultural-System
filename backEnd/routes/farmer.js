const express = require("express");
const router = express.Router();
//const upload = require("../helpers/mwMulter")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const  { 
    recruit, 
    farmerCrop, 
    farmerImage, 
    getFarmerList,
    getFarmerDetails, 
    farmerCropDetails ,
    getFarmerCrops,
    putActiveStatus
}  = require("../controllers/recruitFarmer")
//const { mwMulterS3 } = require("../helpers/mwMulterS3")

router.put("/recruitement/image/:id", farmerImage)
router.put("/recruitement/farmer/:id", putActiveStatus)
router.post("/recruitement", recruit)
router.post("/recruitement/farmer-crop/:id",farmerCrop)
router.get("/recruitement",getFarmerList)
router.get("/recruitement/:id", getFarmerDetails)
router.get("/recruitement/farmer-crop/:year/:id/:addressId",farmerCropDetails)
router.get("/recruitement/crop-barangay/:farmerId/:addressId", getFarmerCrops)

module.exports = router;