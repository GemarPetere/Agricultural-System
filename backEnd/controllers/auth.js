const { dbErrorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const crypto = require("crypto"); // to create token
const mongoose = require("mongoose");
var connection = mongoose.connection;
const User = require("../models/User");



exports.signup = (req, res) => {
  
    User.findOne({ email: req.body?.email }, (err, user) => {
      if (err) {
        return res.status(400).json({
          error: dbErrorHandler(err),
        });
      }
  
      if (user) {
        return res.status(400).json({
          error:
            "This email is already registered, please login to this email instead, you can also use this email to reset your password",
        });
      }
  
      const newUser = new User(req.body);
      newUser.save((err, user) => { 
        if (err) {
          return res.status(400).json({
            error: dbErrorHandler(err),
          });
        }
        return res.status(200).json({
          message:"successfully signup",
          body: user
        })
      });
    });
  };


  exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "The user with this email does not exist. Try again!",
        });
      }
      // if user is found make sure the email and password match
      // create authenticate method in user model
      if (!user.authenticate(password)) {
        return res.status(401).json({
          error: "Invalid Credentials",
        });
      }
      // generate a signed token with user id and secret
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET); // here can also be used expireIn to set expiry date.
      // persist the token as 't' (can be any name) in cookie with expiry date
      res.cookie("t", token, { expire: new Date() + 9999 }); // 9999 seconds
      // return response with user and token to frontend client
      // const { _id, name, email, role } = user;
      user.hashed_password = undefined;
      user.salt = undefined;
      if (user.role === 0) {
        return res.json({ token, user: user });
      } else if (user.role === 1) {
        Shop.findOne({ user: user._id }, (err, shop) => {
          return res.json({ token, user: user, shop: shop });
        });
      } else if (user.role === 2) {
        ShopShop.findOne({ user: user._id }, (err, store) => {
          return res.json({ token, user: user, store: store });
        });
      } else {
        return res.json({ token, user: user, isAdmin: true });
      }
    });
  };