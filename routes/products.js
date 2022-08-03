const express = require("express");
const router = express.Router();

//import in the product model
const { Product } = require('../models')

router.get('/', async (req,res)=>{
    // fetch all the products 
    let products = await Product.collection().fetch();
    res.render('products/index', {
        'products': products.toJSON() // convert collection to JSON
    })
})

module.exports = router;