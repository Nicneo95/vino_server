const express = require('express')
const router = express.Router();

router.get('/', async function (req,res) {
    res.render('product_information/index')
});

module.exports = router;