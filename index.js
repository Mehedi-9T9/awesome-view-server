const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 4000;
require('dotenv').config()

// midleware





app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Awesome view server is running')
})
// console.log(process.env.DB_USER);


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cd4uzfy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();


        const database = client.db("awesome_viewDB");
        const awesome_viewCollaction = database.collection("awesome_view");
        //sent data client
        app.get('/allTourismSpot', async (req, res) => {
            const cursor = awesome_viewCollaction.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/updateTourismSpot/:id', async (req, res) => {
            // console.log(req.params.id);
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await awesome_viewCollaction.findOne(query)
            res.send(result)
        })
        //update
        app.put('/updateTourismSpot/:id', async (req, res) => {
            const data = req.body


            const id = req.params.id
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    tourismSpotName: data.tourismSpotName,
                    tourismCountryName: data.tourismCountryName,
                    totalVisitors: data.totalVisitors,
                    location: data.location,
                    shortDescription: data.shortDescription,
                    averageCost: data.averageCost,
                    seasonality: data.seasonality,
                    travelTime: data.travelTime,
                    userName: data.userName,
                    userEmail: data.userEmail,
                    photo: data.photo
                },
            };
            const result = await awesome_viewCollaction.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        //details page
        app.get('/tourismSpot/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await awesome_viewCollaction.findOne(query)
            res.send(result)
        })

        //my list section
        app.get('/myList/:email', async (req, res) => {
            // const email = req.params.email
            // const id = req.params.id
            // const query = { currentUser: new ObjectId(email) };
            const result = await awesome_viewCollaction.find({ currentUser: req.params.email }).toArray()
            res.send(result)

        })


        //sent database
        app.post('/addTourismSpot', async (req, res) => {
            const data = req.body
            // console.log(data);
            const result = await awesome_viewCollaction.insertOne(data);
            res.send(result)
        })

        //delete
        app.delete('/myList/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await awesome_viewCollaction.deleteOne(query);
            res.send(result)
        })

        // const database = client.db("awesome_viewDB");
        const country = database.collection("countryDB");
        app.post('/addTourismCountry', async (req, res) => {
            const data = req.body
            // console.log(data);
            const result = await country.insertOne(data);
            res.send(result)

        })
        app.get('/addTourismCountry', async (req, res) => {
            const cursor = country.find()
            const result = await cursor.toArray()
            res.send(result)
        })





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);



app.listen(port, () => {
    console.log(`the server running port: ${port}`);
})