const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


// middleware 

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fzaqft4.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection

    const mobilesCollection = client.db("MobileDB").collection("mobiles");
    const cartsCollection = client.db("MobileDB").collection("carts");

// Mobile related 
    app.get("/mobiles", async (req, res) => {
        try {
          const result = await mobilesCollection.find().toArray();
      
          if (!result) {
            return res.status(404).json({ error: "No mobiles found" });
          }
      
          res.send(result);
        } catch (error) {
          console.error("Error fetching mobiles:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });

      app.get("/mobiles/:id", async (req, res) => {
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await mobilesCollection.findOne(query);
      
          if (!result) {
            return res.status(404).json({ error: "Mobile not found" });
          }
      
          res.send(result);
        } catch (error) {
          console.error("Error fetching mobile by ID:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });
      

      app.post("/carts", async (req, res) => {
        try {
          const cart = req.body;
          const result = await cartsCollection.insertOne(cart);
          res.send(result);
        } catch (error) {
          console.error("Error creating cart:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });


    //   cart related

    app.get("/carts", async (req, res) => {
        try {
          const result = await cartsCollection.find().toArray();
      
          if (!result) {
            return res.status(404).json({ error: "No cart items found" });
          }
      
          res.send(result);
        } catch (error) {
          console.error("Error fetching cart items:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });

      app.get("/carts/:id", async (req, res) => {
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await cartsCollection.findOne(query);
      
          if (!result) {
            return res.status(404).json({ error: "cart item not found" });
          }
      
          res.send(result);
        } catch (error) {
          console.error("Error fetching cart item by ID:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });

      app.delete("/carts/:id", async (req, res) => {
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await cartsCollection.deleteOne(query);
      
          if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Cart item not found" });
          }
      
          res.send(result);
        } catch (error) {
          console.error("Error deleting cart item by ID:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });
      



    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('Mobile Hunt is running....')
})

app.listen(port, () => {
  console.log(`Mobile Hunt is listening on port ${port}`)
})