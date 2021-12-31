const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yr4hz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    //get API
    app.get("/services", async(req, res)=>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    })

    //Get single services
    app.get('/services/:id', async (req, res) =>{
        const id = req.params.id;
        console.log('hitting the specific', id)
        const query = {_id: ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service);

    })

    //post method
    app.post("/services", async (req, res) => {
      const service = req.body;      
      const result = await servicesCollection.insertOne(service);      
      res.json(result);
    });

    //Delete Api
    app.delete('/services/:id', async (req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await servicesCollection.deleteOne(query);
        console.log(result);
        res.json(result);
    })

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is the genius car machines server");
});
app.listen(port, () => {
  console.log("running the server", port);
});
