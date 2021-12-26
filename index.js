const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
// const port = 5000;
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qu1uq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("modernFurniture");
    const furnituresCollection = database.collection("furnitures");
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    const reviewsCollection = database.collection("reviews");

    // GET API
    app.get("/furnitures", async (req, res) => {
      const cursor = furnituresCollection.find({});
      const furnitures = await cursor.toArray();
      res.json(furnitures);
    });

    // get single car
    app.get("/furnitures/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const furniture = await furnituresCollection.findOne(query);
      res.json(furniture);
    });

    // get orders
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // get reviews
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // get filtered orders
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = ordersCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });

    // get admin user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "Admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // POST API
    app.post("/furnitures", async (req, res) => {
      const car = req.body;
      const result = await furnituresCollection.insertOne(car);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Modern Furniture!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
