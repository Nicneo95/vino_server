const router = express.Router();

const CartServices = require('../services/cart_services')
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

router.post('/', checkIfAuthenticatedJWT, async function(req, res){
    
    const cartServices = new CartServices(req.user.id)

    let items = await cartServices.getCart();

    if(items.length == 0){
        return res.status(400).send({"message":"Your cart is empty"})
    }

    let insufficientStockItems = await cartServices.stockCheck()

    if(insufficientStockItems.length > 0){
        return res.status(400).send({"message": "Some items in your cart are out of stock. Your cart has been updated"})
    }

    let lineItems = [];
    let meta = [];

    for(let item of items){
        console.log(item.product)
        const lineItem = {
            name: item.related('product').get('name'),
            amount: item.related('product').get('price'),
            quantity: item.get('quantity'),
            ['images'] : [item.related('product').get('image_url')],
            currency: 'SGD'
        }
        lineItems.push(lineItem);
        meta.push({
            product_id : item.get('product_id'),
            quantity: item.get('quantity')
        })
    }

    const payment = {
        client_reference_id: req.user.id,
        payment_method_types: ['card'],
        shipping_address_collection: {
            allowed_countries: ['SG'],
        },
        line_items: lineItems,
        success_url: process.env.CLIENT_BASE_URL + '/checkout-success',
        cancel_url: process.env.CLIENT_BASE_URL,
        metadata: {
            orders: JSON.stringify(meta)
        }
    }
    // later will be deleted
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('checkout/checkout', {
        'sessionId': stripeSession.id, // 4. Get the ID of the session
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
})
// notified via webhook
router.post('/process_payment', express.raw({type: 'application/json'}), async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event;
    
    try {
        
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
        console.log(event)
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
})
module.exports = router;