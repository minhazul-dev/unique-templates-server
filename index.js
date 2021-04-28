const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const objectID = require('mongodb').ObjectID
const port = process.env.PORT || 8080

// console.log(process.env.DB_USER);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('unique website')
})

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oysdd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("uniqueTemplate").collection("services");
  const reviewsCollection = client.db("uniqueTemplate").collection("reviews");
  const ordersCollection = client.db("uniqueTemplate").collection("orders");
  const adminCollection = client.db("uniqueTemplate").collection("adminInfo");
  console.log('db connected successfully');

// For adding services
app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding service ', newService);
    servicesCollection.insertOne(newService)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })

  })
  // for getting services

  app.get('/services', (req, res) => {
    servicesCollection.find()
      .toArray((err, items) => {
        res.send(items)
        // console.log('from db',items)
      })

  })
  // For adding reviews
app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log('adding service ', newReview);
    reviewsCollection.insertOne(newReview)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })

  })
  // for getting services

  app.get('/reviews', (req, res) => {
    reviewsCollection.find()
      .toArray((err, items) => {
        res.send(items)
        // console.log('from db',items)
      })

  })


  //adding orders
  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    // console.log(newOrder);
  })
 

  // Getting specific email orders
  app.get('/orders', (req, res) => {
    ordersCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })


//getting all orders

app.get('/allOrders', (req, res) => {
  ordersCollection.find({})                   
  .toArray((err, documents)=>{
    res.send(documents)
  })
  

})

 
//making admin
app.post('/adminEmail', (req, res) => {
  const newAdmin = req.body;
  console.log(newAdmin);
  adminCollection.insertOne(newAdmin)
    .then(result => {
      console.log(result)
      res.send(result.insertedCount > 0)
      
    })
  // console.log(newOrder);
})


app.get('/isAdmin',(req, res)=>{
  const email= req.query.email
  adminCollection.find({email:email})
  .toArray((err,documents)=>{
    console.log(documents);
    res.send(documents.length>0)
  })

})





//deleting services 
app.delete('/deleteProduct/:id', (req, res) => {

  const id = objectID(req.params.id);
  console.log('delete this ', id);
  servicesCollection.findOneAndDelete({ _id: objectID(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
      console.log(result);
    });
  console.log(req.params.id);

})

});


app.listen((process.env.PORT || port))