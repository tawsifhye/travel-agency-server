const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.youri.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("travel_agency");
        const tourPlans = database.collection("tour_plans")
        const bookedEvent = database.collection("booked_event")

        //GET API
        app.get('/tourplans', async (req, res) => {
            const result = await tourPlans.find({}).toArray();
            res.send(result);
        })

        //GET API
        app.get('/tourplans/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await tourPlans.findOne(query);
            res.send(result);
        })

        //POST API
        app.post('/bookedevents', async (req, res) => {
            const item = req.body;
            const result = await bookedEvent.insertOne(item);
            res.send(result);
        })

        //     //GET API
        //     app.get('/enrolledcourses/:email', async(req, res) => {
        //       const email = req.params.email;
        //       const result = await enrolledCourses.find({email:{$regex: email}}).toArray();
        //       // const result = await enrolledCourses.insertOne(enrolled);
        //       res.send(result);
        //   })

        // app.delete('/services/:id', async(req, res)=>{
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};
        //     const result = await servicesCollection.deleteOne(query);
        //     res.json(result);
        // })

        //UPDATE or PUT API

        /* app.put('/users/:id', async(req, res) => {
          const id = req.params.id;
          const updatedUser = req.body;
          const filter = {_id: ObjectId(id)};
          const options = {upsert: true};
          const updatedDoc = {
            $set:{
              name: updatedUser.name,
              email: updatedUser.email
            }
          };
          const result = await usersCollection.updateOne(filter, updatedDoc, options);
          console.log("updated user", id);
          res.json(result);
        }) */

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Running  Server");
})

app.listen(port, () => {
    console.log("Running  Server on port", port);
})