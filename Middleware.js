const Listing = require("./Models/listing.js");
const Review = require("./Models/review.js");
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; //store the url in the session
        req.flash("error" , "please sign up or log in  to add your listing");
       return res.redirect("/login");
    }
    next();
};

module.exports.savedReturnTo = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
    };



    module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    console.log(id ,  res.locals.currentUser._id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error" , "You are not authorized to do this");
        return res.redirect(`/listing/${id}`);
    }
    next();
    }
    module.exports.isAuthor = async(req, res, next)=>{
    let { id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    console.log(review);
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error" , "You are not authorized to do this");
        return res.redirect(`/listing/${id}`);
    }
    }