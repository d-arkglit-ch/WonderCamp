const Listing= require('../Models/listing.js');

module.exports.index = async(req ,res)=>{
    const listings = await Listing.find({});
    res.render("./listing/index.ejs" , {listings});
};


module.exports.renderNewForm = (req ,res)=>{
    
    res.render("./listing/new.ejs");
};


module.exports.showListing = async(req ,res)=>{
     let id = req.params.id;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"},}).populate("owner");

    if(!listing){
        req.flash("error", " The Listing you requested does not exist");
        return res.redirect("/listing");
    }
    console.log(listing);
    res.render("listing/show.ejs", {listing});
};
module.exports.renderEditForm  = async(req ,res)=>{
console.log("edit");
    let id = req.params.id;
    console.log(id);
    const listing  = await Listing.findById(id);
console.log( "edit" );
    let orignalImageUrl =  listing.image.url;
    orignalImageUrl.replace("/upload" , "/upload/h_300,2_250");
    res.render("listing/edit.ejs" , {listing ,orignalImageUrl});

};


module.exports.postListing=async(req ,res)=>{
 

console.log("1");
  let  url = req.file.path;
  let filename = req.file.filename;
let listing = req.body.listing;
const newList = new Listing(listing);
newList.owner = req.user._id;
newList.image = {url , filename};
await newList.save();
req.flash("success" , "succesfully added a new listing");
res.redirect("/listing");

    };


    module.exports.updateListing=async(req , res)=>{
    
        let {id} =  req.params;
        console.log(id);
       let listing =  await Listing.findByIdAndUpdate(id , {...req.body.listing});
       console.log("1")
        //deconstructing editList
        if(typeof req.file!=="undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
            console.log("2")
            listing.image = {url , filename};
                await listing.save();


        }
   req.flash("success" , "succesfully updated the listing");

        res.redirect("/listing");
        
    };

    module.exports.deleteListing= async(req, res)=>{

    let id =req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "succesfully deleted the listing");
    res.redirect("/listing");
};