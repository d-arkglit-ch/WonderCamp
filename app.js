const express = require("express");
const app=express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
app.engine("ejs" ,ejsMate);
const ExpressError = require("./utils/ExpressError.js");
const flash  = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/User.js");

if(process.env.NODE_ENV !== "production"){//if the environment is not production then use dotenv
    require("dotenv").config();
}
const dbURL = process.env.MONGOATLAS_URL ;

const Review =require("./Models/review.js");
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname , "public")));
const method_override = require("method-override");
app.use(method_override("_method"));

const listing=require("./routes/listing.js");
const review=require("./routes/reviews.js");
const user = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
main()
.then(()=>{console.log("connected to DB");

})
.catch((err)=>{console.log(err);

});
async function main(){
    await mongoose.connect(dbURL);
}



//using cookies
const store =  MongoStore.create({
    mongoUrl :dbURL,
    crypto:{
secret:   process.env.SECRET
    },
    touchAfter:24*60*60, //24 hours
});
const sessionOpt= {
    store,
    secret:process.env.SECRET,//secret key to encrypt the session",
    resave:false,
    saveUninitialized:true,
    cookie:{//seting up the cookies expires maxage details
        expires:Date.now()+1000*60*60*24*7, //7 days
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOpt));//using cookees as a middleware

app.use(flash());//using flash as a middleware


app.use(passport.initialize());//intializing passport
app.use(passport.session());//using passport as a middleware passport.session() is used to save the session in the cookies
passport.use( new LocalStrategy(User.authenticate()));//using passport to authenticate the user
passport.serializeUser(User.serializeUser());//using passport to serialize the user or store the user in the session
passport.deserializeUser(User.deserializeUser());//using passport to deserialize the user or get the user out from the session


app.use((req ,res , next)=>{
    res.locals.success = req.flash("success");//using flash to show success message
    res.locals.error=req.flash("error");//using flash to show error message
    res.locals.currentUser = req.user;
    next();
})//should be above the routes


app.use("/listing" , listing);
app.use("/listing/:id/reviews" , review);
app.use("/" , user);//using user route to register and login the user





//to handel all the path other than the given path above
app.use((req , res, next)=>{
    next(new ExpressError(404 , "page not found"));
});


//error handler any error it encounter will come here
app.use((err ,req ,res ,next)=>{
    let {statusCode=500 , message="something went wrong"}=err;
res.render("error.ejs" , {message , statusCode})
});

app.listen(8000 , ()=>{
    console.log("ok done connecting");
});