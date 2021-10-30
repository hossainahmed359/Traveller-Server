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

        // Find User with email
        app.get('/finduser/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = usersCollection.find(query);
            const result = await cursor.toArray();
            res.json(result);
            // console.log(user);
        });

        // Update User
        app.post('/updateuser/:id', async (req, res) => {
            const userId = req.params.id;
            const query = { _id: ObjectId(userId) };
            const user = req.body.user;

            const replcement = {
                number: user.number,
                location: user.location,
                desitinations: user.desitinations
            }

            const result = await usersCollection.replaceOne(query, replcement)

            res.send(result)
            //console.log(req.body.user)
            // console.log(result)


        });

        // Place Order
        app.post('/placeOrder', async (req, res) => {
            const user = req.body.user;
            // console.log(user)

            const result = await usersCollection.insertOne(user)
            // console.log(result)
            res.send(result);
        });

        // Delete Order
        app.delete('/deleteOrder/:id', async (req, res) => {
            const userId = req.params.id;
            const query = { _id: ObjectId(userId) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);