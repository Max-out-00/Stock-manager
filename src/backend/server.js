import express from "express";
import connectDB from "./db.js";

const app = express();
app.use(express.json());

const collection = await connectDB();

app.post("/register", async (req, res) => {
  const { email , password } = req.body;

  const findEmail = await collection.findOne({email: email});

  if(!findEmail){

      await collection.insertOne({ email , password});
      res.json({ message: "User added" });
    }
    else{
        res.json({message: "User already exists "})
    }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});