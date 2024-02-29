const express = require('express')
const mongoose = require("mongoose");
const cors = require('cors');
const User=require('./Models/user.models.js')
const jwt = require('jsonwebtoken');




// const router = require('./Routes/user.route.js');
const authrouter = require('./Routes/auth.route.js');


const app = express()
app.use(cors())
app.use(express.json())

// app.use('/user', router) 
app.use('/api', authrouter) 


const connectDB = async () => {
    mongoose.connect("mongodb://localhost:27017/Re-comm");
    const productSchema = new mongoose.Schema({});
    const product = mongoose.model("products", productSchema);
    const data = await product.find();
    console.warn(data);
}
connectDB();



require("dotenv").config();
const PORT = process.env.PORT || 4000;


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status (statusCode).json({
    success: false,
    statusCode,
    message,
    });
    });

// const dbConnect = require("./Config/Database");
// dbConnect();



const bcrypt = require('bcrypt');


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
            expiresIn: '2h' // Token expires in 2 hours
        });

        // Set cookie with JWT token
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
            secure: process.env.NODE_ENV === 'production' // Enable secure cookie in production
        });


        // Passwords match, login successful
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.post("/google", async (req, res) =>{
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
})



app.get("/", (req,res) => {
    res.send(`<h1> This is HOME PAGE baby</h1>`);
})



app.listen(PORT,()=>{
    console.log(`server is connected at ${PORT}` );
})