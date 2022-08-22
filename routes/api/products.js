const express = require('express')
const router = express.Router();

const productDAL = require('../../dal/products.js')

const {
    Category,
    Country,
    Region,
    Producer,
    Size,
    GrapeVarietal,
    Product
} = require('../../models');

router.get('/category', async (req, res) => {
    try {
        let categories = await Category.fetchAll()

        res.status(200).send(categories)

    } catch (e) {
        res.status(500).send({ "message": "Unable to retrieve categories due to internal server error" })
    }
})

router.get('/country', async (req, res) => {
    try {
        let countries = await Country.fetchAll()

        res.status(200).send(countries)

    } catch (e) {
        res.status(500).send({ "message": "Unable to retrieve countries due to internal server error" })
    }
})

router.get('/region', async (req, res) => {
    try {
        let regions = await Region.fetchAll()

        res.status(200).send(regions)

    } catch (e) {
        res.status(500).send({ "message": "Unable to retrieve regions due to internal server error" })
    }
})

router.get('/size', async (req, res) => {
    try {
        let sizes = await Size.fetchAll()

        res.status(200).send(sizes)

    } catch (e) {
        res.status(500).send({ "message": "Unable to retrieve sizes due to internal server error" })
    }
})

router.get('/producer', async (req, res) => {
    try {
        let producers = await Producer.fetchAll()

        res.status(200).send(producers)

    } catch (e) {
        res.status(500).send({ "message": "Unable to retrieve producers due to internal server error" })
    }
})

router.get('/grape-varietal', async (req, res) => {
    try {
        let grapeVarietals = await GrapeVarietal.fetchAll()

        res.status(200).send(grapeVarietals)

    } catch (e) {
        res.status(500).send({ "message": "Unable to retrieve grape varietals due to internal server error" })
    }
})

router.get('/', async (req, res) => {
    try {

        let q = Product.collection();

        if (req.query.categoryFilter) {
            q.where('category_id', '=', req.query.categoryFilter)
        }

        if (req.query.searchInput) {
            q = q.query(qb => {
                qb.where('name', 'ilike', '%' + req.query.searchInput + '%')
                .orWhere('description', 'ilike', '%' + req.query.searchInput + '%')
                .orWhere('nose_attribute', 'ilike', '%' + req.query.searchInput + '%')
                .orWhere('mouth_attribute', 'ilike', '%' + req.query.searchInput + '%')
            })
        }

        let products = await q.fetch({
            withRelated: [
                'category', 
                'country', 
                'region', 
                'producer', 
                'grape_varietal', 
                'size'
            ]
        });

        res.status(200).send(products)


    } catch (e) {
        res.status(500).send({ "message": "Unable to retrieve products due to internal server error" })
    }
})

router.get('/:product_id', async (req, res) => {
    try {
        console.log(req.params.product_id)
        let product = await productDAL.getProductById(req.params.product_id)

        console.log(product.toJSON())

        res.status(200).send(product)


    } catch (e) {
        res.status(500).send({ "message": "Unable to retrieve product due to internal server error" })
    }
})

module.exports = router;