const mongoose = require("mongoose");
const Schema =  mongoose.Schema;
const reviewSchema = require("./review.js");
const user = require("./User.js");

const ListingSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{//default check if image is undefined
       url:String,
         filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});
ListingSchema.post("findOneAndDelete" ,async(listing)=>{
    if(listing){
        await reviewSchema.deleteMany({_id: {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing" , ListingSchema);
module.exports =Listing;