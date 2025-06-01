const cloudinary = require('cloudinary').v2;
const  { CloudinaryStorage}= require('multer-storage-cloudinary');

//configuaring clodunary

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key :process.env.CLOUD_API_KEY,
api_secret : process.env.CLOUD_API_SECRET,

});

//defineing cloudinary storage 

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'wonderCamp',
        allowed_formats:["png" , "jpg", "jpeg"],
    },
})

module.exports = {
    cloudinary,
    storage,
}