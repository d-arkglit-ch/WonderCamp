const express = require("express");
const app=express();
const router = express.Router();
const passport = require("passport");
app.use(express.urlencoded({ extended: true }));
const {savedReturnTo} = require("../Middleware.js");
const UserController = require("../Controller/user.js");

const User = require("../Models/User.js")
router.get("/signUp" ,UserController.signUpGet);
router.post("/signUp",UserController.signupPost );

router.get("/login",UserController.loginGet);


router.post("/login" , savedReturnTo, passport.authenticate("local" , {failureRedirect:"/login" ,failureFlash:true}) , UserController.loginPost);
router.get('/logout' ,UserController.logoutGet);

module.exports =router;
