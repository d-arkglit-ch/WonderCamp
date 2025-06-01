const express = require("express");
const app=express();
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {ListingSchema , reviewSchema} = require("../schema.js");
const Review =require("../Models/review.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn , isOwner , isAuthor} = require("../Middleware.js");
const reviewController = require("../Controller/review.js");
const validateReview =(req  ,res , next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        console.log(error.details.map(el=>el.message).join(", "));
        throw  new ExpressError(400 ,error.details.map(el=>el.message).join(", "));
    }else{
    next();
    }
    }


    
router.post("/", isLoggedIn,validateReview , wrapAsync(reviewController.postReview));


router.delete("/:reviewId" ,isLoggedIn,isAuthor, wrapAsync(reviewController.deleteReview ));
    module.exports = router;