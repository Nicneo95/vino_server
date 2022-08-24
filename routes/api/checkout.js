const express = require('express');
const router = express.Router();

const CartServices = require('../../services/cart'); 
const OrderServices = require('../../services/orders')
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

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
        client_reference_id: req.session.user.id,
        payment_method_types: ['card'],
        shipping_address_collection: {
            allowed_countries: ['SG'],
        },
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            'orders': metaData
        }
    }
    console.log(metaData)
    console.log(payment)

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