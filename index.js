const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.74novyu.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // Connect to the "insertDB" database and access its "haiku" collection
        const database = client.db("mashTechDB");
        const productCollection = database.collection("products");
        const blogCollection = database.collection("blogs");
        const cartCollection = database.collection("carts");
        const upcomingCollection = database.collection("upcoming");
        const brandCollection = database.collection("brands");
        const testimonialCollection = database.collection("testimonials");
        

        app.get("/products", async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        });

        app.post("/products", async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        app.put("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedProduct = req.body;
            const product = {
                $set: {
                    name: updatedProduct.name,
                    brand: updatedProduct.brand,
                    category: updatedProduct.category,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating,
                    image: updatedProduct.image,
                },
            };
            const result = await productCollection.updateOne(
                query,
                product,
                options
            );
            res.send(result);
        });

        app.get("/carts", async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post("/carts", async (req, res) => {
            const newCart = req.body;
            console.log(newCart);
            const result = await cartCollection.insertOne(newCart);
            res.send(result);
        });

        app.delete("/carts/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: `${id}` };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        });

        //blogs
        app.post("/blogs", async (req, res) => {
            const newBlog = req.body;
            console.log(newBlog);
            const result = await blogCollection.insertOne(newBlog);
            res.send(result);
        });

        app.get("/blogs", async (req, res) => {
            const cursor = blogCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        //testimonials
        app.post("/testimonials", async (req, res) => {
            const newTestimonial = req.body;
            console.log(newTestimonial);
            const result = await testimonialCollection.insertOne(
                newTestimonial
            );
            res.send(result);
        });

        app.get("/testimonials", async (req, res) => {
            const cursor = testimonialCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        //upcoming
        app.post("/upcoming", async (req, res) => {
            const upcoming = req.body;
            console.log(upcoming);
            const result = await upcomingCollection.insertOne(upcoming);
            res.send(result);
        });

        app.get("/upcoming", async (req, res) => {
            const cursor = upcomingCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        //brands
        app.post("/brands", async (req, res) => {
            const brands = req.body;
            console.log(brands);
            const result = await brandCollection.insertOne(brands);
            res.send(result);
        });

        app.get("/brands", async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("mash tech server is running");
});

app.listen(port, () => {
    console.log(`mash tech server is running from port: ${port}`);
});
