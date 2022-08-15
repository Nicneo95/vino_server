const express = require('express');
const router = express.Router(); // create a new express router

// add a new route to the express router
router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/product-information/product')
    } else {
        res.redirect('/user/login')
    }
})

module.exports = router; // export out the router
