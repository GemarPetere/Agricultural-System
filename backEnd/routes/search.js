const express = require("express");
const router = express.Router();
const { search, searchBarangay, searchCrops, searchDataBarangay, matiCrops } = require("../controllers/search")
//const { mwMulterS3 } = require("../helpers/mwMulterS3")
router.get("/search/farmer/:crop/:year", searchCrops)
router.get("/search2/:name/:year", search)
router.get("/search3/:barangay/:year", searchBarangay)
router.get("/search4/dashboard", searchDataBarangay)
router.get("/search5/:year", matiCrops)



module.exports = router;