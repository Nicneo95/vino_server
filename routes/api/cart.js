const express = require("express");
const router = express.Router();

const CartServices = require('../../services/cart');
// show cart item working
router.get('/', async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    res.render('carts/index', {
        'shoppingCart': (await cart.getCart()).toJSON()
    })
})

router.get('/:product_id/add', async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    await cart.addToCart(req.params.product_id, 1);
    req.flash('success_messages', 'Product added to cart successfully')
    res.redirect('/cart')
})

router.get('/:product_id/remove', async (req, res) => {
    let cartServices = new CartServices(req.session.user.id)

    await cartServices.removeFromCart(req.params.product_id);

    req.flash('success_messages', 'Product has been removed from the shopping cart')
    res.redirect('/cart');
})

router.post('/:product_id/quantity/update', async (req, res) => {

    let cartServices = new CartServices(req.session.user.id)

    if (parseInt(req.body.newQuantity) == 0) {
        await cartServices.removeFromCart(req.params.product_id);
        req.flash('success_messages', 'You have removed this item from your cart' )
        res.redirect('/cart')
       } else if (parseInt(req.body.newQuantity) > 0) {
        let result = await cartServices.updateQuantity(req.params.product_id, parseInt(req.body.newQuantity))
        if (result) {
            req.flash('success_messages', 'Quantity changed successfully' )
            res.redirect('/cart')
            // return res.status(200).send({ "message": "Quantity changed successfully" })
        } else {
            req.flash('success_messages', `Sorry, there ${req.body.newQuantity - 1 === 1 ? 'is' : 'are'} only ${req.body.newQuantity - 1} of this item left in stock` )
            res.redirect('/cart')
        //     return res.status(400).send({ "message": `Sorry, there ${req.body.newQuantity - 1 === 1 ? 'is' : 'are'} only ${req.body.newQuantity - 1} of this item left in stock` })
        }
    } else if (parseInt(req.body.newQuantity) < 0) {
        req.flash('success_messages', 'Please enter a positive number' )
        res.redirect('/cart')
    //     return res.status(400).send({ "message": "Please enter a positive number" })
    }
})

module.exports = router;