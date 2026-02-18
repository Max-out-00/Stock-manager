import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/loginDB");

const User = mongoose.model("User",{
  email:String,
  password:String
});

app.post("/login", async (req,res)=>{

   const {email,password} = req.body;

   const user = await User.findOne({email,password});

   if(user) res.json("SUCCESS");
   else res.json("NOT FOUND");

});

app.listen(5000,()=>console.log("Server running"));