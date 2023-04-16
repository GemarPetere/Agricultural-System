const express = require("express");
const router = express.Router();

const  { recruit, farmerCrop, farmerImage, getFarmer }  = require("../controllers/recruitFarmer")
//const { mwMulterS3 } = require("../helpers/mwMulterS3")

router.post("/recruitement", recruit)
//router.put("/recruitement/:id", farmerImage )
router.post("/recruitement/farmer-crop/:id",farmerCrop)
router.get("/recruitement",getFarmer)

module.exports = router;