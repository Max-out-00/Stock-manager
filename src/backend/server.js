import express from "express";
import connectDB from "./db.js";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // allow frontend requests

// connect and grab both collections
const { users: usersCollection, stocks: stocksCollection } = await connectDB();

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= register -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

app.post("/register", async (req, res) => {
  const { email , password } = req.body;

  const existing = await usersCollection.findOne({ email });

  if (!existing) {
      await usersCollection.insertOne({ email, password });
      return res.json({ success: true, message: "User added" });
  }

  res.json({ success: false, message: "User already exists" });
});

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= Login -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await usersCollection.findOne({ email });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  if (password !== user.password) {
    return res.json({ success: false, message: "Wrong password" });
  }

  const token = jwt.sign(
    { userId: user._id },
    "mySecretKey",
    { expiresIn: "1h" }
  );

  // also send back basic user info so frontend can remember userId
  res.json({ success: true, token, user: { _id: user._id, email: user.email } });
});

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= Add stock -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
app.post("/dashboard", async (req, res) => {
  const { stock, money, share, userId } = req.body;

  await stocksCollection.insertOne({
    userId,
    stock,
    money,
    share,
    date: new Date()
  });

  res.json({ success: true });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});