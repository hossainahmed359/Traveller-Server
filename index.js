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

        // Add A New Service
        app.post('/addService', async (req, res) => {
            const data = req.body.data;
            const result = await servicesCollection.insertOne(data)
            res.json(result)
        });

        // Find All Orders
        app.get('/allOrders', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
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
            const userBody = req.body.order;
            console.log(userBody)
            const query = { _id: ObjectId(userId) };


            const replcement = {
                email: userBody.email,
                name: userBody.name,
                number: userBody.number,
                localStorage: userBody.location,
                date: userBody.date,
                destination: { id: userBody.destination.id, status: 'Approved' }
            }

            const result = await usersCollection.replaceOne(query, replcement)

            console.log(result)
            res.json(result)



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
            console.log(result)
            res.json(result);
        });

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


// repository link changed