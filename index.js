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

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const productCollection = client.db("categoryDB").collection("product");

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

    // create product

    app.post("/product", async (req, res) => {
      try {
        const product = req.body;
        const newProduct = await productCollection.insertOne(product);
        res.status(201).send(newProduct);
      } catch (error) {
        res.status(500).send("Server Internal Error");
      }
    });

    // get product
    app.get("/product/:brand", async (req, res) => {
      try {
        const brand = req.params.brand;
        const filter = { brand: brand };
        const products = await productCollection.find(filter).toArray();
        res.status(200).send(products);
      } catch (error) {
        res.status(500).send("Server Internal Error");
      }
    });

    // update product

    app.put("/product/:id", async (req, res) => {
      try {
        const { name, price, image, description, brand, rating } = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateProduct = {
          $set: {
            name,
            price,
            image,
            description,
            brand,
            rating,
          },
        };
        const updatedProduct = await productCollection.updateOne(
          filter,
          updateProduct,
          options
        );

        res.status(200).send(updatedProduct);
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
