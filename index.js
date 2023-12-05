const express = require('express')



const mongoose = require('mongoose')



const config = require('./config/app')
mongoose.connect(config.mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then((res)=>console.log('Connected to MongoDB')).catch((err)=>console.log(`DB connection error: ${err}`))





const app = express()

require('./config/express')(app)


const Product = mongoose.model('Product',{
    id: mongoose.Schema.Types.ObjectId,
    name: {type:String, required:true},
    Price: {type:String, required:true},
    description: {type:String, required:true},
})

app.get('/products', (req, res) => Product.find().exec().then(products => res.json(products)))
app.get('/products/:_id', (req, res) => Product.findById({_id: req.params._id}, req.body).exec().then(products => res.json(
    {
        _id:products._id,
        name:products.name,
        Price:products.Price,
        description:products.description
    }
)))


app.post('/products', (req,res)=> Product.create(req.body).then(createdProduct => res.json(createdProduct)))

app.put('/products/:_id', (req,res)=> Product.findOneAndUpdate({_id: req.params._id}, req.body).exec().then(product => res.json(product)))

app.delete('/products/:id', (req,res)=> Product.deleteOne({id: req.params.id}).exec().then(()=> res.json({success: true})))









const User = mongoose.model('User',{
    id: mongoose.Schema.Types.ObjectId,
    login: {type:String, required:true},
    password: {type:String, required:true},
    role:{type: String, default: 'User'}
})
app.get('/users/', (req, res) => User.find().exec().then(user => res.json(user)))
app.get('/users/:_id', (req, res) => User.findById({_id: req.params._id}, req.body).exec().then(user => res.json(user)))



app.post('/users', (req,res)=> User.create(req.body)
.then(createdUser =>{
    if(createdUser)
    {
        res.status(201).json({
            message: "user created",
            createdUser
        })
    }

}))
     

app.post('/signin', (req,res) => {
    User.find({login: req.body.login}).select("_id login password role").exec().then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: "Auth failed"
            })
        }
        if(req.body.password!=user[0].password){
            return res.status(401).json({
                    message: "Auth failed"
                })
        }
        else{
            return res.status(200).json({
                            message: "Auth successful",
                            _id: user[0]._id,
                        })
        }
 
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

app.put('/users/:_id', (req,res)=> User.findOneAndUpdate({_id: req.params._id}, req.body).exec().then(user => res.json(user)))

app.delete('/users/:_id', (req,res)=> User.deleteOne({_id: req.params._id}).exec().then(()=> res.json({success: true})))










app.listen(3000, () => console.log('listening port 3000...'))