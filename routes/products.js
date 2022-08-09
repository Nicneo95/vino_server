const express = require('express')
const router = express.Router();

const { Category, Country } = require('../models');

const { categoryForm, countryForm, bootstrapField } = require('../forms');

// test product-information route 
router.get('/', async function (req,res) {
    res.render('product_information/index')
});

// category route start
router.get('/category', async function (req,res) {
    let category = (await Category.fetchAll()).toJSON();
    res.render('product_information/category/index', {
        category
    })
});
// get category form information 
router.get('/category/create', async function (req,res) {
    const form = categoryForm();

    res.render('product_information/category/create', {
        form: form.toHTML(bootstrapField)
    })
});
// post form input to server
router.post('/category/create', async (req, res) => {
    const form = categoryForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data

            const category = new Category(formData);

            await category.save()

            res.redirect('/product-information/category');
        },
        'error': async (form) => {
            res.render('product_information/category/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// get id information to update
router.get('/category/:category_id/update', async function (req, res) {
    const category = await Category.where({
        id: req.params.category_id
    }).fetch({
        require: true
    })
    const form = categoryForm();
    form.fields.name.value = category.get('name')

    res.render('product_information/category/update', {
        form: form.toHTML(bootstrapField),
        category: category.toJSON()
    })
})
// post form input to server
router.post('/category/:category_id/update', async function (req, res) {
    const category = await Category.where({
        id: req.params.category_id
    }).fetch({
        require: true
    });
    const form = categoryForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data;

            category.set(formData);
            await category.save();

            res.redirect('/product-information/category');
        },
        'error': async (form) => {
            res.render('product_information/category/update', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// get id information to delete
router.get('/category/:category_id/delete', async function (req, res) {
    const category = await Category.where({
        id: req.params.category_id
    }).fetch({
        require: true
    });
    res.render('product_information/category/delete', {
        category: category.toJSON()
    })
})
// post form to delete
router.post('/category/:category_id/delete', async function (req, res) {
    const category = await Category.where({
        id: req.params.category_id
    }).fetch({
        require: true
    });
    await category.destroy();
    res.redirect('/product-information/category')
})

router.get('/country', async function (req, res) {
    let country = (await Country.fetchAll()).toJSON();

    res.render('product_information/country/index', {
        country
    })
})

router.get('/country/create', async function (req, res) {
    const form = countryForm();
    res.render('product_information/country/create', {
        'form': form.toHTML(bootstrapField)
    })
})

router.post('/country/create', async (req, res) => {
    const form = countryForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data

            const country = new Country(formData);

            await country.save()

            res.redirect('/product-information/country');
        },
        'error': async (form) => {
            res.render('product_information/country/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/country/:country_id/update', async function (req, res) {
    const country = await Country.where({
        id: req.params.country_id
    }).fetch({
        require: true
    })

    const form = countryForm();
    form.fields.name.value = country.get('name')

    res.render('product_information/country/update', {
        form: form.toHTML(bootstrapField),
        country: country.toJSON()
    })
})

router.post('/country/:country_id/update', async function (req, res) {
    const country = await Country.where({
        id: req.params.country_id
    }).fetch({
        require: true
    })
    const form = countryForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data;

            country.set(formData);
            await country.save();

            res.redirect('/product-information/country');
        },
        'error': async (form) => {
            res.render('product_information/country/update', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/country/:country_id/delete', async function (req, res) {
    const country = await Country.where({
        id: req.params.country_id
    }).fetch({
        require: true
    })
    res.render('product_information/country/delete', {
        country: country.toJSON()
    })
})

router.post('/country/:country_id/delete', async function (req, res) {
    const country = await Country.where({
        id: req.params.country_id
    }).fetch({
        require: true
    })
    await country.destroy();
    res.redirect('/product-information/country')
})

module.exports = router;