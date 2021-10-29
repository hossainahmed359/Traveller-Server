// Importing necessary files
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');
const app = express();

// Require 
const ObjectId = require('mongodb').ObjectId;
const { query } = require('express');
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors());

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
        // Get Database 
        await client.connect();
        const database = client.db("Traveller");
        const servicesCollection = database.collection("services");
        const usersCollection = database.collection('users');

        // Get Services 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // Get Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // Find User
        app.get('/finduser/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            console.log(query)
            const user = await usersCollection.findOne(query);
            res.send(user)
            console.log(user)
        });

        // Create User
        app.post('/user', async (req, res) => {
            const user = req.body.user;
            const result = await usersCollection.insertOne(user)
            console.log(user)
            res.send(result)
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);