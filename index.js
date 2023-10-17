const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("My-Server Side");
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.dbURL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const categoryCollection = client.db("categoryDB").collection("category");

    // create category

    app.post("/category", async (req, res) => {
      try {
        const category = req.body;
        const newCategory = await categoryCollection.insertOne(category);
        res.status(201).send(newCategory);
      } catch (error) {
        res.status(500).send("Server Internal Error");
      }
    });
    // get category

    app.get("/category", async (req, res) => {
      try {
        const categorys = await categoryCollection.find().toArray();
        res.status(200).send(categorys);
      } catch (error) {
        res.status(500).send("Server Internal Error");
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
