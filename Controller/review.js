const Listing = require('../Models/listing.js');
const Review = require('../Models/review.js');
module.exports.postReview =async(req , res)=>{
    let id = req.params.id;
    console.log(req.params.id);
    let currentListing = await Listing.findById(id);
let newreview =  new Review(req.body.review);
let user = req.user._id;
newreview.author = user;
currentListing.reviews.push(newreview);
await newreview.save();
await currentListing.save();
console.log(currentListing);
res.redirect(`/listing/${id}`);

};


module.exports.deleteReview = async(req ,res)=>{

    let{ id , reviewId}= req.params;
    await Listing.findByIdAndUpdate(id , {$pull:{review:reviewId}});//pull opearator pull the  element out of any documentation
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
    };
