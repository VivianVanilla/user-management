const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://vivianbonilla:8DU9JlJXPSrcjiCM@capstone.gptiazz.mongodb.net/?retryWrites=true&w=majority&appName=Capstone";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db

async function mongoDB() {
    await client.connect();
    
    db = client.db("userdata");

    console.log("Connected to MongoDB");

    return db;
}
mongoDB().catch(console.dir);

module.exports = mongoDB;