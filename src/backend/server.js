import express from "express";
import connectDB from "./db.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import { ObjectId } from "mongodb";

const app = express();
app.use(express.json());
app.use(cors()); // allow frontend requests

// connect and grab both collections
const { users: usersCollection, stocks: stocksCollection } = await connectDB();

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= register -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existing = await usersCollection.findOne({ email });

  if (!existing) {
    const result = await usersCollection.insertOne({ email, password });
    const newUser = { _id: result.insertedId, email };
    const token = jwt.sign(
      { userId: result.insertedId },
      "mySecretKey",
      { expiresIn: "1h" }
    );

    return res.json({ success: true, message: "User added", token, user: newUser });
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
  try {
    const { stock, quantity, total, userId } = req.body;

    if (!stock || !userId || !quantity || !total) {
      return res.status(400).json({ success: false, message: 'Missing required stock data.' });
    }

    await stocksCollection.insertOne({
      userId,
      stock,
      quantity,
      total,
      createdAt: new Date(),
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Dashboard save error:', error);
    res.status(500).json({ success: false, message: 'Unable to save stock data.' });
  }
});

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= Get user portfolio -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
app.get("/api/userData/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    const userStocks = await stocksCollection.find({ userId }).toArray();

    res.json(userStocks);
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch portfolio data.' });
  }
});

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= Sell stock -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
app.post("/api/sellStock", async (req, res) => {
  try {
    const { userId, quantity, stockId } = req.body;

    if (!userId || !quantity) {
      return res.status(400).json({ success: false, message: 'Missing required data.' });
    }

    // Find the specific stock to sell
    let userStock;
    if (stockId) {
      // If stockId is provided, use it
      userStock = await stocksCollection.findOne({ _id: new ObjectId(stockId), userId });
    } else {
      // Otherwise get the first stock for this user
      userStock = await stocksCollection.findOne({ userId });
    }

    if (!userStock) {
      return res.status(404).json({ success: false, message: 'No stock found to sell.' });
    }

    const remainingQuantity = userStock.quantity - quantity;

    if (remainingQuantity < 0) {
      return res.status(400).json({ success: false, message: 'Cannot sell more shares than owned.' });
    }

    if (remainingQuantity === 0) {
      // Delete the stock entry if all shares are sold
      await stocksCollection.deleteOne({ _id: new ObjectId(userStock._id) });
    } else {
      // Update quantity and total
      const newTotal = (userStock.stock.price * remainingQuantity).toFixed(2);
      await stocksCollection.updateOne(
        { _id: new ObjectId(userStock._id) },
        {
          $set: {
            quantity: remainingQuantity,
            total: newTotal,
            updatedAt: new Date(),
          }
        }
      );
    }

    res.json({ success: true, message: 'Stock sold successfully.' });
  } catch (error) {
    console.error('Sell stock error:', error);
    res.status(500).json({ success: false, message: 'Unable to sell stock.' });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

