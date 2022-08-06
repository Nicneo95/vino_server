const express = require('express')
const router = express.Router();

const { Category } = require('../models');

const { categoryForm, bootstrapField } = require('../forms');

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
    res.render('product_information/category/create', {
        form: categoryForm.toHTML(bootstrapField)
    })
});
// send category form to server 
router.post('/category/create', async function (req,res) {
    const form = categoryForm();

    form.handle(req, {
        'sucess': async (form) => {
            let {...formData} = form.formData
            const category = new Category(formData);
            await category.save()
            res.redirect('/product-information/category');
        },
        'error': async (form) => {
            res.render('/product-information/category/create', {
                form: form.toHTML(bootstrapField)
            })
        },
        'empty': async (form) => {}
    })
})

module.exports = router;