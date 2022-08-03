const express = require('express');
const router = express.Router(); // create a new express router

// add a new route to the express router
router.get('/', (req,res)=>{
    res.render('landing/index')
})
router.get('/order', (req,res)=>{
    res.render('landing/order')
})
router.get('/product', (req,res)=>{
    res.render('landing/product')
})
router.get('/shipment', (req,res)=>{
    res.render('landing/shipment')
})

module.exports = router; // export out the router
