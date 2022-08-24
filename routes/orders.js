const express = require('express');
const router = express.Router();
const orderDAL = require('../dal/orders')
const productDAL = require('../dal/products')

const { Order, OrderBreakdown, OrderStatus } = require('../models');

const { bootstrapField, searchOrderForm, orderForm } = require('../forms');

router.get('/', async function (req, res) {
    const allOrderStatuses = await orderDAL.getAllOrderStatuses()
    allOrderStatuses.unshift(["", "All"])
    const allProducts = await productDAL.getAllProducts()
    allProducts.unshift(["", "All"])

    const searchForm = searchOrderForm(allOrderStatuses, allProducts);

    let q = Order.collection();

    searchForm.handle(req, {
        'success': async function (form) {

            if (form.data.order_status_id) {
                q.where('order_status_id', '=', form.data.order_status_id)
            }

            if (form.data.min_amount) {
                q.where('total_amount', '>=', form.data.min_amount);
            }

            if (form.data.max_amount) {
                q.where('total_amount', '<=', form.data.max_amount);
            }

            if (form.data.products) {
                q.query('join', 'orders_product', 'orders.id', 'order_id')
                    .where('product_id', 'in', form.data.products.split(','))
            }

            let orders = await q.fetch({
                withRelated: ['order_status', 'product', 'order_breakdowns']
            })

            res.render('order_information/index', {
                orders: orders.toJSON(),
                searchForm: form.toHTML(bootstrapField)
            })
        },
        'error': async function (form) {
            let orders = await q.fetch({
                withRelated: ['order_status', 'product', 'order_breakdowns']
            })

            res.render('order_information/index', {
                orders: orders.toJSON(),
                searchForm: form.toHTML(bootstrapField)
            })

        },
        'empty': async function (form) {
            let orders = await q.fetch({
                withRelated: ['order_status', 'product', 'order_breakdowns']
            })

            res.render('order_information/index', {
                orders: orders.toJSON(),
                searchForm: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/order/:order_id/update', async function (req, res) {

    const order = await orderDAL.getOrderById(req.params.order_id)
    const allOrderStatuses = await orderDAL.getAllOrderStatuses()
    const form = orderForm(allOrderStatuses)
    form.fields.order_status_id.value = order.get('order_status_id');
    
    res.render('order_information/update', {
        form: form.toHTML(bootstrapField),
        order: order.toJSON()
    })

})

router.post('/order/:order_id/update', async function (req, res) {

    const order = await orderDAL.getOrderById(req.params.order_id)

    const allOrderStatuses = await orderDAL.getAllOrderStatuses()
    const allProducts = await productDAL.getAllProducts()
    
    const form = orderForm(allOrderStatuses, allProducts)

    form.handle(req, {
        'success': async(form) => {

            order.set({order_status_id: form.data.order_status_id});
            order.set({date_updated: new Date() })

            await order.save()

            req.flash("success_msg", "Order has been updated successfully!")
            res.redirect('/order-information');

        }, 'error': async (form) => {
            res.render('order_information/update', {
                form: form.toHTML(bootstrapField)
            })
        }
    })

})

router.get('/order/:order_id/delete', async function (req, res) {
    const order = await orderDAL.getOrderById(req.params.order_id)

    res.render('order_information/delete', {
        order: order.toJSON()
    })
})

router.post('/order/:order_id/delete', async function (req, res) {
    const order = await orderDAL.getOrderById(req.params.order_id)
    await order.destroy();
    res.redirect('/order-information')



})

module.exports = router
