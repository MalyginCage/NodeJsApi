const express = require('express')



const mongoose = require('mongoose')




const config = require('./config/app')
mongoose.connect(config.mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then((res)=>console.log('Connected to MongoDB')).catch((err)=>console.log(`DB connection error: ${err}`))





const app = express()

require('./config/express')(app)


const Product = mongoose.model('Product',{
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    Price: mongoose.Schema.Types.Decimal128,
})

app.get('/products', (req, res) => Product.find().exec().then(products => res.json(products)))
app.get('/products/:_id', (req, res) => Product.findById({_id: req.params._id}, req.body).exec().then(products => res.json(products)))


app.post('/products', (req,res)=> Product.create(req.body).then(createdProduct => res.json(createdProduct)))

app.put('/products/:id', (req,res)=> Product.findOneAndUpdate({id: req.params.id}, req.body).exec().then(product => res.json(product)))

app.delete('/products/:id', (req,res)=> Product.deleteOne({id: req.params.id}).exec().then(()=> res.json({success: true})))









const User = mongoose.model('User',{
    id: mongoose.Schema.Types.ObjectId,
    login: String,
    password: String,
    role:{type: String, default: 'User'}
})
app.get('/users/', (req, res) => User.find().exec().then(user => res.json(user)))
app.get('/users/:_id', (req, res) => User.findById({_id: req.params._id}, req.body).exec().then(user => res.json(user)))



app.post('/users', (req,res)=> User.create(req.body).then(createdUser => res.json(createdUser)))

app.put('/users/:_id', (req,res)=> User.findOneAndUpdate({_id: req.params._id}, req.body).exec().then(user => res.json(user)))

app.delete('/users/:_id', (req,res)=> User.deleteOne({_id: req.params._id}).exec().then(()=> res.json({success: true})))










app.listen(3000, () => console.log('listening port 3000...'))