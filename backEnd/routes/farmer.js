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
    farmerCropDetails 
}  = require("../controllers/recruitFarmer")
//const { mwMulterS3 } = require("../helpers/mwMulterS3")

router.put("/recruitement/image/:id", farmerImage)
router.post("/recruitement", recruit)
router.post("/recruitement/farmer-crop/:id",farmerCrop)
router.get("/recruitement",getFarmerList)
router.get("/recruitement/farmer-crop/:year/:id",farmerCropDetails)

module.exports = router;