// Importing necessary files
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Test
app.get('/', (req, res) => {
    res.send('Node Mongo Server Running');
})

app.listen(port, () => {
    console.log('listening to port', port);
})

// Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3zcg9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// CRUD Operations
async function run() {
    try {
        await client.connect();
        const database = client.db("Traveller");
        const servicesCollection = database.collection("services");

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);