const {
    Order,
    OrderBreakdown,
    OrderStatus,
} = require('../models')

async function getAllOrderStatuses() {
    return await OrderStatus.fetchAll().map(status => [status.get('id'), status.get('name')])
}

async function getOrderById(orderId) {
    return await Order.where({
        'id': orderId
    }).fetch()
}

async function getAllOrdersByUser(userId) {
    return await Order.collection().where({
        user_id: userId
    }).fetch({
        withRelated: ['order_status, order_breakdown']
    })
}

async function getSpecificOrderByUser(orderId, userId) {
    return await Order.where({
        id: orderId,
        user_id: userId
    }).fetch({
        withRelated: ['order_status, order_breakdown.product']
    })
}

async function getAllOrders() {
    return await Order.collection().fetch({
        withRelated:['order_status']
    })
}

async function createOrderBreakdown(orderId, orderData){
    let orderBreakdown = new OrderBreakdown({
        order_id: orderId,
        product_id: orderData.product_id,
        quantity: orderData.quantity
    })
    return await orderBreakdown.save()
}

async function createOrder(orderData) {

    const newOrder = new Order({
        total_amount: orderData.total_amount,
        payment_reference: orderData.payment_reference,
        order_status_id: 2,
        user_id: orderData.user_id,
        shipping_address: orderData.shipping_address,
        date_placed: new Date(),
        date_updated: new Date()
    });

    await newOrder.save();

    let newOrderId = newOrder.get("id")

    return newOrderId;

}

module.exports = { 
    getAllOrderStatuses,
    getOrderById,
    getAllOrdersByUser,
    getSpecificOrderByUser,
    getAllOrders,
    createOrderBreakdown,
    createOrder,
 }