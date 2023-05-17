const express = require("express");
const router = express.Router();
const { search, searchBarangay, searchCrops, searchDataBarangay } = require("../controllers/search")
//const { mwMulterS3 } = require("../helpers/mwMulterS3")
router.get("/search/farmer/:crop", searchCrops)
router.get("/search2/:name", search)
router.get("/search3/:barangay", searchBarangay)
router.get("/search4/:barangay", searchDataBarangay)



module.exports = router;