const express = require("express");
const router = express.Router();

const { checkIfAuthenticatedJWT } = require('../../middlewares');

const CartServices = require('../../services/cart');
// show cart item working
router.get('/', checkIfAuthenticatedJWT, async (req, res) => {
    let cart = new CartServices(req.user.id);
    res.render('carts/index', {
        'shoppingCart': (await cart.getCart()).toJSON()
    })
})

router.get('/:product_id/add', checkIfAuthenticatedJWT, async (req, res) => {
    let cart = new CartServices(req.user.id);
    await cart.addToCart(req.params.product_id, 1);
    req.flash('success_messages', 'Product added to cart successfully')
    res.redirect('/cart')
})

router.get('/:product_id/remove', checkIfAuthenticatedJWT, async (req, res) => {
    let cartServices = new CartServices(req.user.id)

    await cartServices.removeFromCart(req.params.product_id);

    req.flash('success_messages', 'Product has been removed from the shopping cart')
    res.redirect('/cart');
})

router.post('/:product_id/quantity/update', checkIfAuthenticatedJWT, async (req, res) => {

    let cartServices = new CartServices(req.user.id)

    if (parseInt(req.body.newQuantity) == 0) {
        await cartServices.removeFromCart(req.params.product_id);
        req.flash('success_messages', 'You have removed this item from your cart' )
        res.redirect('/cart')
       } else if (parseInt(req.body.newQuantity) > 0) {
        let result = await cartServices.updateQuantity(req.params.product_id, parseInt(req.body.newQuantity))
        if (result) {
            req.flash('success_messages', 'Quantity changed successfully' )
            res.redirect('/cart')
        } else {
            req.flash('success_messages', `Sorry, there ${req.body.newQuantity - 1 === 1 ? 'is' : 'are'} only ${req.body.newQuantity - 1} of this item left in stock` )
            res.redirect('/cart')
        }
    } else if (parseInt(req.body.newQuantity) < 0) {
        req.flash('success_messages', 'Please enter a positive number' )
        res.redirect('/cart')
    }
})

module.exports = router;