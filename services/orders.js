const orderDAL = require('../dal/orders');
const cartDAL = require('../dal/cart_items')
const productDAL = require('../dal/products')

async function createOrderBreakdown(orderId, orderData){
    return await orderDAL.createOrderBreakdown(orderId, orderData)
}

async function createOrder(stripeEvent) {

    console.log('testing order creation')

    let shippingAddress = `
    Addressee: ${stripeEvent.shipping.name}
    -Address Line 1: ${stripeEvent.shipping.address.line1}
    -Address Line 2: ${stripeEvent.shipping.address.line2}
    -City: ${stripeEvent.shipping.address.city}
    -State: ${stripeEvent.shipping.address.state}
    -Country: ${stripeEvent.shipping.address.country}
    -Postcode: ${stripeEvent.shipping.address.postal_code}
    `
    let orderData = {
        total_amount: stripeEvent.amount_total,
        payment_reference: stripeEvent.payment_intent,
        user_id: stripeEvent.client_reference_id,
        shipping_address: shippingAddress,
    }

    let newOrderId = await orderDAL.createOrder(orderData)

    let allOrderedItems = JSON.parse(stripeEvent.metadata.orders)

    allOrderedItems.map( async(item) => {
        await orderDAL.createOrderBreakdown(newOrderId, item)
        await cartDAL.removeFromCart(stripeEvent.client_reference_id, item.product_id)

        let productToUpdate = await productDAL.getProductById(item.product_id)

        console.log('productToUpdate', productToUpdate)
        let stock = productToUpdate.get("stock")
        
        productToUpdate.set('stock', stock - item.quantity)
        await productToUpdate.save()

    })
}

module.exports = {
    createOrderBreakdown,
    createOrder
}
