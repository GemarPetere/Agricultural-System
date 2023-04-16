const express = require("express");
const router = express.Router();
const { userSignupValidator } = require("../validator");
const { signup, signin } = require("../controllers/auth");


router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin)

module.exports = router;
