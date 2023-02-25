const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u6oqlug.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri)




 async function run() {
    try {
        const database = client.db('emaJohn').collection('products')

        app.get('/products', async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            console.log(page, size);

            const query = {};
            const cursor = database.find(query);
            // const products = await cursor.limit(10).toArray();
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await database.estimatedDocumentCount();

            // console.log(result)
            res.send({count, products});
        });

        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            console.log(ids)
            const ObjectsIds = ids.map(id => new ObjectId(id))
            const query = {_id: {$in: ObjectsIds}};
            const cursor = database.find(query)
            const products = await cursor.toArray();
            res.send(products)
        })
    }
    finally {

    }
 }
 run().catch(console.dir)
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


app.get('/', (req, res) => {
    res.send('Ema John server is running')
})

app.listen(port, () => {
    console.log(`ema john server is listening at ${port}`)
})