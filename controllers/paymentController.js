const { SECRET_KEY,PUBLISHABLE_KEY} =process.env;
const Fine = require ("../model/fine.model");


const stripe=require('stripe')(SECRET_KEY)


const renderBuyPage = async(req,res)=>{

    try {
        
        res.render('/pages/fine', {
            key: PUBLISHABLE_KEY,
            amount:25
         })

    } catch (error) {
        console.log(error.message);
    }

}

const payment = async(req,res)=>{

    try {

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'asdfgh',
        address: {
            line1: 'asdf, cvbnm',
            postal_code: '12365',
            city: 'zxcvb',
            state: 'xcvb cvb',
            country: 'India',
        }
    })
    .then((customer) => {
 
        return stripe.charges.create({
            amount: req.body.amount,     // amount will be amount*100
            description: req.body.productName,
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        res.redirect("/pages/success")
    })
    .catch((err) => {
        res.redirect("/pages/failure")
    });


    } catch (error) {
        console.log(error.message);
    }

}

const success = async(req,res)=>{

    try {
        
        res.render('success');

    } catch (error) {
        console.log(error.message);
    }

}

const failure = async(req,res)=>{

    try {
        
        res.render('failure');

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    renderBuyPage,
    payment,
    success,
    failure
}