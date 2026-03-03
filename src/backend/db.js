import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url);

// Connect and return an object with any collections we'll need later.
async function connectDB(){
    try {
        await client.connect();
        const database = client.db('UserDB_DAA_project');
        const users = database.collection("UserDB");
        const stocks = database.collection("stocks"); // separate collection for dashboard entries
        console.log("Connection successful to MongoDB");
        return { users, stocks };
    } catch (error) {
        console.log("Error:" , error);
        await client.close();
    }
}

export default connectDB;