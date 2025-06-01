const express = require("express");
const app=express();
const multer = require("multer");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {ListingSchema , reviewSchema} = require("../schema.js");
// const Listing = require("../Models/listing.js");
const {isLoggedIn} = require("../Middleware.js");
const {isOwner}= require("../Middleware.js");
const ListingController= require("../Controller/listing.js");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing =(req  ,res , next)=>{
let {error} = ListingSchema.validate(req.body);
if(error){
    console.log(error.details.map(el=>el.message).join(", "));
    throw  new ExpressError(400 ,error.details.map(el=>el.message).join(", "));
}else{
next();
}
}


router.get("/" , wrapAsync(ListingController.index)
);

router.get("/new" ,isLoggedIn, ListingController.renderNewForm);
router.get("/:id" ,wrapAsync(ListingController.showListing));





router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(ListingController.renderEditForm));

router.post("/" , isLoggedIn ,upload.single('listing[image]'), validateListing , wrapAsync(ListingController.postListing)
);




router.put("/:id" , isLoggedIn , isOwner ,upload.single('listing[image]'),validateListing ,wrapAsync(ListingController.updateListing)
);

router.delete("/:id" ,isLoggedIn,isOwner , wrapAsync(ListingController.deleteListing));


module.exports=router; 