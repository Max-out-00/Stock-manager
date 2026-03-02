import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017/'
const client = new MongoClient(url);

async function connectDB(){
    
    try {
        await client.connect();
        const database = client.db('UserDB_DAA_project')
        const collection = database.collection("UserDB")
        console.log("Connectio sucessful")
        return collection

    } catch (error) {
        console.log("Error:" , error) 
        await client.close()       
    }
}

export default connectDB;