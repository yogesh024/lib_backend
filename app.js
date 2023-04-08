require("dotenv").config(); // load env file
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expHbs = require('express3-handlebars');
var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
const mongoose = require('mongoose');
const book = require('./routes/book/index')

const DB='mongodb+srv://y55:y55@cluster0.5jb58bg.mongodb.net/book';


mongoose.set('strictQuery', false);
mongoose.set('strictQuery', true);

mongoose.connect(DB)
.then(()=>{
   console.log("connected ")
})
.catch(()=>{

    console.log("fieled to connect")
})

const PUBLISHABLE_KEY="pk_test_51Mo1MYSGfS5jrW5jYb2rKIVBRUsmNz20H64EZcCgqZszI2AmcHtrd6ngcaTZJjthDB8u8uNSE7Lx1QXf2C5DYp7g00yj6TZnRC"
const SECRET_KEY="sk_test_51Mo1MYSGfS5jrW5j8LBF379kbI46l2FXlQ9ooJ5hunEmTWiHSRMRlicZCxv8T9Ya2YoowfnoasX58k5r1clFJ5tz00ZYLkz5dg"
const stripe=require('stripe')(SECRET_KEY)



const async = require("async");

const app = express();

/**
 * Make MongoDB connection
 */
// (async () => {
//     await mongoose.connect('mongodb+srv://y55:y55@cluster0.5jb58bg.mongodb.net/book');
// })();

app.engine('hbs', expHbs({defaultLayout: 'layout', extname: '.hbs'}))
app.set('view engine', 'hbs')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json());


app.use('/', indexRouter);
app.use('/user',book)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
app.get('/',(req,res)=>{
    res.render("pages/fine",{
        key:PUBLISHABLE_KEY
    })
})
app.post('/payment',(req,res)=>{
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        name:'yogesh',
        adress:{
            line1:'askjdl',
            postal_code:'1100',
            country:'india'
        }
    })
    .then((customer)=>{
        return stripe.create({
            amount:120,
            currency:'USD',
            customer:customer.id

        })

    })
    .then((charge)=>{
        console.log(charge)
        res.send("success")
    })
    .catch((err)=>{
        res.send(err)
    })


})

// error handler
app.listen(8999, ()=>{
    console.log("listening to the port 8580")
})

    

module.exports = app;
