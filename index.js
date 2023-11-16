const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// connecting to mongodb 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.scdnbhm.mongodb.net/?retryWrites=true&w=majority`;

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
       

        // collections 
        const foodsCollection = client.db('foodDB').collection('food');
        const foodsRequestCollection = client.db('foodDB').collection('requestedFood');

        // getting foods 
        app.get('/featured-foods', async (req, res) => {
            const cursor = foodsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/requested-foods', async (req, res) => {
            const cursor = foodsRequestCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // getting foods by id
        app.get('/featured-foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodsCollection.findOne(query);
            res.send(result);
        })
        // sending foods to database 
        app.post("/featured-foods", async (req, res) => {
            const addedFood = req.body;
            const result = await foodsCollection.insertOne(addedFood);
            res.send(result);
          });
        app.post("/requested-foods", async (req, res) => {
            const requestedFood = req.body;
            const result = await foodsRequestCollection.insertOne(requestedFood);
            res.send(result);
          });


          app.delete('/requested-foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodsRequestCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('crud and jwt is running')
})
app.listen(port, () => {
    console.log(`crud and jwt is running: ${port}`);
})