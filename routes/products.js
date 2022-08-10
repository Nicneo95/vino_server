const express = require('express')
const router = express.Router();

const { Category, Country, Producer, Region, GrapeVarietal } = require('../models');

const { categoryForm, countryForm, producerForm, regionForm, grapeVarietalForm, bootstrapField } = require('../forms');

// test product-information route 
router.get('/', async function (req,res) {
    res.render('product_information/index')
});

// category CRUD route
// category index route 
router.get('/category', async function (req,res) {
    let category = (await Category.fetchAll()).toJSON();
    res.render('product_information/category/index', {
        category
    })
});
// category create route 
router.get('/category/create', async function (req,res) {
    const form = categoryForm();

    res.render('product_information/category/create', {
        form: form.toHTML(bootstrapField)
    })
});
// category create route 
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
// category update route
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
// category update route
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
// category delete route
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
// category delete route
router.post('/category/:category_id/delete', async function (req, res) {
    const category = await Category.where({
        id: req.params.category_id
    }).fetch({
        require: true
    });
    await category.destroy();
    res.redirect('/product-information/category')
})

// country CRUD route
// country index route 
router.get('/country', async function (req, res) {
    let country = (await Country.fetchAll()).toJSON();

    res.render('product_information/country/index', {
        country
    })
})
// country create route
router.get('/country/create', async function (req, res) {
    const form = countryForm();
    res.render('product_information/country/create', {
        'form': form.toHTML(bootstrapField)
    })
})
// country create route
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
// country update route
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
// country update route
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
// country delete route
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
// country delete route
router.post('/country/:country_id/delete', async function (req, res) {
    const country = await Country.where({
        id: req.params.country_id
    }).fetch({
        require: true
    })
    await country.destroy();
    res.redirect('/product-information/country')
})

// producer CRUD route
// producer index route 
router.get('/producer', async function (req, res) {
    let producer = (await Producer.fetchAll()).toJSON();

    res.render('product_information/producer/index', {
        producer
    })
})
// producer create route
router.get('/producer/create', async function (req, res) {
    const form = producerForm();
    res.render('product_information/producer/create', {
        'form': form.toHTML(bootstrapField)
    })
})
// producer create route
router.post('/producer/create', async (req, res) => {
    const form = producerForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data

            const producer = new Producer(formData);

            await producer.save()

            res.redirect('/product-information/producer');
        },
        'error': async (form) => {
            res.render('product_information/producer/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// producer update route
router.get('/producer/:producer_id/update', async function (req, res) {
    const producer = await Producer.where({
        id: req.params.producer_id
    }).fetch({
        require: true
    });

    const form = producerForm();
    form.fields.name.value = producer.get('name')
    form.fields.description.value = producer.get('description')

    res.render('product_information/producer/update', {
        form: form.toHTML(bootstrapField),
        producer: producer.toJSON(),
    })
})
// producer update route
router.post('/producer/:producer_id/update', async function (req, res) {
    const producer = await Producer.where({
        id: req.params.producer_id
    }).fetch({
        require: true
    });

    const form = producerForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data;

            producer.set(formData);
            await producer.save();

            res.redirect('/product-information/producer');
        },
        'error': async (form) => {
            res.render('product_related/region/update', {
                'form': form.toHTML(bootstrapField),
            })
        }
    })
})
// producer delete route
router.get('/producer/:producer_id/delete', async function (req, res) {
    const producer = await Producer.where({
        id: req.params.producer_id
    }).fetch({
        require: true
    });

    res.render('product_information/producer/delete', {
        producer: producer.toJSON()
    })
})
// producer delete route
router.post('/producer/:producer_id/delete', async function (req, res) {
    const producer = await Producer.where({
        id: req.params.producer_id
    }).fetch({
        require: true
    });
    await producer.destroy();
    res.redirect('/product-information/producer')
})

// region CRUD route
// region index route 
router.get('/region', async function (req, res) {
    let region = (await Region.fetchAll()).toJSON();

    res.render('product_information/region/index', {
        region
    })
})
// region create route 
router.get('/region/create', async function (req,res) {
    const form = regionForm();

    res.render('product_information/region/create', {
        form: form.toHTML(bootstrapField)
    })
});
// region create route 
router.post('/region/create', async (req, res) => {
    const form = regionForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data

            const category = new Region(formData);

            await category.save()

            res.redirect('/product-information/region');
        },
        'error': async (form) => {
            res.render('product_information/region/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// region update route
router.get('/region/:region_id/update', async function (req, res) {
    const region = await Region.where({
        id: req.params.region_id
    }).fetch({
        require: true
    })
    const form = regionForm();
    form.fields.name.value = region.get('name')

    res.render('product_information/region/update', {
        form: form.toHTML(bootstrapField),
        region: region.toJSON()
    })
})
// region update route
router.post('/region/:region_id/update', async function (req, res) {
    const region = await Region.where({
        id: req.params.region_id
    }).fetch({
        require: true
    });
    const form = regionForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data;

            region.set(formData);
            await region.save();

            res.redirect('/product-information/region');
        },
        'error': async (form) => {
            res.render('product_information/region/update', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// region delete route
router.get('/region/:region_id/delete', async function (req, res) {
    const region = await Region.where({
        id: req.params.region_id
    }).fetch({
        require: true
    });
    res.render('product_information/region/delete', {
        region: region.toJSON()
    })
})
// region delete route
router.post('/region/:region_id/delete', async function (req, res) {
    const region = await Region.where({
        id: req.params.region_id
    }).fetch({
        require: true
    });
    await region.destroy();
    res.redirect('/product-information/region')
})

// grape varietal CRUD route
// grape varietal index route 
router.get('/grape-varietal', async function (req, res) {
    let grape_varietal = (await GrapeVarietal.fetchAll()).toJSON();

    res.render('product_information/grape_varietal/index', {
        grape_varietal
    })
})
// grape varietal create route 
router.get('/grape-varietal/create', async function (req,res) {
    const form = grapeVarietalForm();

    res.render('product_information/grape_varietal/create', {
        form: form.toHTML(bootstrapField)
    })
});
// grape varietal create route 
router.post('/grape-varietal/create', async (req, res) => {
    const form = grapeVarietalForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data

            const category = new GrapeVarietal(formData);

            await category.save()

            res.redirect('/product-information/grape-varietal');
        },
        'error': async (form) => {
            res.render('product_information/grape_varietal/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// grape varietal update route
router.get('/grape-varietal/:grape_varietal_id/update', async function (req, res) {
    const grape_varietal = await GrapeVarietal.where({
        id: req.params.grape_varietal_id
    }).fetch({
        require: true
    })
    const form = grapeVarietalForm();
    form.fields.name.value = grape_varietal.get('name')

    res.render('product_information/grape_varietal/update', {
        form: form.toHTML(bootstrapField),
        grape_varietal: grape_varietal.toJSON()
    })
})
// grape varietal update route
router.post('/grape-varietal/:grape_varietal_id/update', async function (req, res) {
    const grape_varietal = await GrapeVarietal.where({
        id: req.params.grape_varietal_id
    }).fetch({
        require: true
    });
    const form = grapeVarietalForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data;

            grape_varietal.set(formData);
            await grape_varietal.save();

            res.redirect('/product-information/grape-varietal');
        },
        'error': async (form) => {
            res.render('product_information/grape_varietal/update', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// region delete route
router.get('/grape-varietal/:grape_varietal_id/delete', async function (req, res) {
    const grape_varietal = await GrapeVarietal.where({
        id: req.params.grape_varietal_id
    }).fetch({
        require: true
    });
    res.render('product_information/grape_varietal/delete', {
        grape_varietal: grape_varietal.toJSON()
    })
})
// region delete route
router.post('/grape_varietal/:varietal_grape_id/delete', async function (req, res) {
    const grape_varietal = await GrapeVarietal.where({
        id: req.params.grape_varietal_id
    }).fetch({
        require: true
    });
    await grape_varietal.destroy();
    res.redirect('/product-information/grape-varietal')
})

module.exports = router;