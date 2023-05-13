const express = require("express");
const router = express.Router();
const { search, searchBarangay, searchCrops } = require("../controllers/search")
//const { mwMulterS3 } = require("../helpers/mwMulterS3")
router.get("/search/farmer/:crop/:year", searchCrops)
router.get("/search2/:name", search)
router.get("/search3/:barangay", searchBarangay)



module.exports = router;