const express = require('express');
const router = express.Router();

const CartServices = require('../../services/cart'); 
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// router.post('/', checkIfAuthenticatedJWT, async function(req, res){
    
//     const cartServices = new CartServices(req.user.id)

//     let items = await cartServices.getCart();

//     if(items.length == 0){
//         return res.status(400).send({"message":"Your cart is empty"})
//     }

//     let insufficientStockItems = await cartServices.stockCheck()

//     if(insufficientStockItems.length > 0){
//         return res.status(400).send({"message": "Some items in your cart are out of stock. Your cart has been updated"})
//     }

//     let lineItems = [];
//     let meta = [];

//     for(let item of items){
//         console.log(item.product)
//         const lineItem = {
//             name: item.related('product').get('name'),
//             amount: item.related('product').get('price'),
//             quantity: item.get('quantity'),
//             ['images'] : [item.related('product').get('image_url')],
//             currency: 'SGD'
//         }
//         lineItems.push(lineItem);
//         meta.push({
//             product_id : item.get('product_id'),
//             quantity: item.get('quantity')
//         })
//     }

//     const payment = {
//         client_reference_id: req.user.id,
//         payment_method_types: ['card'],
//         shipping_address_collection: {
//             allowed_countries: ['SG'],
//         },
//         line_items: lineItems,
//         success_url: process.env.CLIENT_BASE_URL + '/checkout-success',
//         cancel_url: process.env.CLIENT_BASE_URL,
//         metadata: {
//             orders: JSON.stringify(meta)
//         }
//     }
//     // later will be deleted
//     let stripeSession = await Stripe.checkout.sessions.create(payment)
//     res.render('checkout/checkout', {
//         'sessionId': stripeSession.id, // 4. Get the ID of the session
//         'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
//     })
// })
// // notified via webhook
// router.post('/process_payment', express.raw({type: 'application/json'}), async (req, res) => {
//     let payload = req.body;
//     let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
//     let sigHeader = req.headers["stripe-signature"];
//     let event;
    
//     try {
        
//         event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
//         console.log(event)
//         if (event.type ==  "checkout.session.completed") {
//             let stripeEvent = event.data.object;

//             await OrderServices.createOrder(stripeEvent)

//             res.status(200).send('Order Received')

//         }
//     } catch(e) {
//         res.send({
//             "error": e.message
//         })
//     }
// })
router.get('/',  async (req, res) => {
    const cart = new CartServices(req.session.user.id);

    // get all the items from the cart
    let items = await cart.getCart();

    // step 1 - create line items
    let lineItems = [];
    let meta = [];
    for (let item of items) {
        const lineItem = {
            'name': item.related('product').get('name'),
            'amount': item.related('product').get('price'),
            'quantity': item.get('quantity'),
            'currency': 'SGD'
        }
        if (item.related('product').get('image_url')) {
            lineItem['images'] = [item.related('product').get('image_url')]
        }
        lineItems.push(lineItem);
        // save the quantity data along with the product id
        meta.push({
            'product_id' : item.get('product_id'),
            'quantity': item.get('quantity')
        })
    }

    // step 2 - create stripe payment
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            'orders': metaData
        }
    }

    // step 3: register the session
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('checkout/checkout', {
        'sessionId': stripeSession.id, // 4. Get the ID of the session
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
});

router.post('/process_payment', express.raw({type: 'application/json'}), async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event;
    
    try {
        
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
        if (event.type ==  "checkout.session.completed") {
            let stripeEvent = event.data.object;

            await OrderServices.createOrder(stripeEvent)

            res.status(200).send('Order Received')

        }
    } catch(e) {
        res.send({
            "error": e.message
        })
    }
});

router.get('/success', function (req, res) {
    res.send({'message' : 'Your order has been confirmed'})
});

router.get('/cancelled', function (req, res) {
    res.send({'message': 'Your order has been cancelled'})
});

module.exports = router;