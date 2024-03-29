const express =require('express');
const User=require('../Models/user.models.js')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')

const signup= async (req,res)=>{
const {username,email,password}=req.body;
const hashedPassword=bcrypt.hashSync(password,10)
const newUser=new User ({username,email,password:hashedPassword});
await newUser.save();
res.status(201).json('user created');

}


const signin = async (req, res, next) => {
    const { email, password, username } = req.body; // Include username here
    try {
      const validUser = await User.findOne({ email });
      if (!validUser) return next(errorHandler(404, 'User not found!'));
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
      const token = jwt.sign({ id: validUser._id } );
    //   const { password: pass, ...rest } = validUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(validUser);
    } catch (error) {
      next(error);
    }
  };


//  const google =async(req,res)=>{
//   try{
//     const user= await User.findOne({email:req.body.email})
//    if(user){
//   const token =jwt.sign({id:user._id},'your-secret-key');
//   const {password:pass,...rest}=user._doc
//   res.cookie('access_token',token,{httpOnly:true})
//   .status(200)
//   .json(rest);
// }
// else{
//   const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
//   const hashedPassword= bcrypt.hashSync(generatedPassword,10);
//   const newUser= new User({username:req.body.name.split('').join('').toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashedPassword,avatar:req.body.photo});
//   await newUser.save();
//   const token=jwt.sign({id:newUser._id},'your-secret-key');
//   const {password:pass,...rest}=newUser._doc;
//   res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);

// }
//   }
//   catch(error){
//     console.log("This is Error ",error);
//   }
//  }




const google = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, 'your-secret-key');
      const { password: pass, ...rest } = user._doc;
      res.cookie('access_token', token, { httpOnly: true })
         .status(200)
         .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: req.body.name.split('').join('').toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, 'your-secret-key');
      const { password: pass, ...rest } = newUser._doc;
      res.cookie('access_token', token, { httpOnly: true })
         .status(200)
         .json(rest);
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


const signOut = async (req, res) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    console.log("Error:", error);
  }
};


module.exports={google, signup,signin,signOut};