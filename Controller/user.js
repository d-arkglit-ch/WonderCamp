const User = require("../Models/User.js");

module.exports.signupPost =async(req, res)=>{
  try{
    let { username , email , password} = req.body;
    const newUser = new User({email , username});
    console.log(newUser);
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser ,(err)=>{
      if(err){
       return next(err)
      }
      req.flash("success"  , "Successfully registered" );
      res.redirect("/listing");
    })
 
  }catch(e){
    console.log(e);
    req.flash("error" , e.message);
    res.redirect("/signUp");
  }
};

module.exports.signUpGet = (req, res)=>{
res.render("user/register.ejs");
};


module.exports.loginGet = (req , res)=>{
    res.render("user/login.ejs");
};

module.exports.loginPost = async(req, res)=>{
 req.flash("success" , "Welcome back" );
 let  redirectUrl = res.locals.redirectUrl||"/listing";
 console.log(redirectUrl);
    res.redirect(redirectUrl);
};


module.exports.logoutGet = (req, res, next)=>{
  req.logout(function(err){
if(err){
  return next(err);
}
req.flash("success" , "logged out");
res.redirect(res.locals.redirectUrl||"/listing"); 
  })
};

