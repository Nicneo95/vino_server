const express = require('express')
const router = express.Router();

const { Category, Country, Producer, Region, GrapeVarietal, Size, Product } = require('../models');

const { categoryForm, countryForm, producerForm, regionForm, grapeVarietalForm, sizeForm, productForm, bootstrapField } = require('../forms');

// test product-information route 
router.get('/', async function (req, res) {
    res.render('product_information/index')
});

// category CRUD route
// category index route 
router.get('/category', async function (req, res) {
    let category = (await Category.fetchAll()).toJSON();
    res.render('product_information/category/index', {
        category
    })
});
// category create route 
router.get('/category/create', async function (req, res) {
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

            req.flash("success_messages", `New category ${category.get('name')} has been created`)

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

            req.flash("success_messages", `Category ${category.get('name')} has been updated`)

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

            req.flash("success_messages", `New country ${country.get('name')} has been created`)

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

            req.flash("success_messages", `Country ${country.get('name')} has been updated`)

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

            req.flash("success_messages", `New producer ${producer.get('name')} has been created`)

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

            req.flash("success_messages", `Producer ${producer.get('name')} has been updated`)

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
router.get('/region/create', async function (req, res) {
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

            const region = new Region(formData);

            await region.save()

            req.flash("success_messages", `New region ${region.get('name')} has been created`)

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

            req.flash("success_messages", `Region ${region.get('name')} has been updated`)

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
router.get('/grape-varietal/create', async function (req, res) {
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

            const grapeVarietal = new GrapeVarietal(formData);

            await grapeVarietal.save()

            req.flash("success_messages", `New grape varietal ${grapeVarietal.get('name')} has been created`)

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
    const grapeVarietal = await GrapeVarietal.where({
        id: req.params.grape_varietal_id
    }).fetch({
        require: true
    });

    const form = grapeVarietalForm();
    form.fields.name.value = grapeVarietal.get('name')

    res.render('product_information/grape_varietal/update', {
        form: form.toHTML(bootstrapField),
        grapeVarietal: grapeVarietal.toJSON()
    })
})
// grape varietal update route 
router.post('/grape-varietal/:grape_varietal_id/update', async function (req, res) {
    const grapeVarietal = await GrapeVarietal.where({
        id: req.params.grape_varietal_id
    }).fetch({
        require: true
    });

    const form = grapeVarietalForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data;

            grapeVarietal.set(formData);
            await grapeVarietal.save();

            req.flash("success_messages", `Grape varietal ${grapeVarietal.get('name')} has been updated`)

            res.redirect('/product-information/grape-varietal');
        },
        'error': async (form) => {
            res.render('product_information/grape_varietal/update', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// grape varietal delete route 
router.get('/grape-varietal/:grape_varietal_id/delete', async function (req, res) {
    const grapeVarietal = await GrapeVarietal.where({
        id: req.params.grape_varietal_id
    }).fetch({
        require: true
    });

    res.render('product_information/grape_varietal/delete', {
        grapeVarietal: grapeVarietal.toJSON()
    })
})
// grape varietal delete route 
router.post('/grape-varietal/:grape_varietal_id/delete', async function (req, res) {
    const grapeVarietal = await GrapeVarietal.where({
        id: req.params.grape_varietal_id
    }).fetch({
        require: true
    });

    await grapeVarietal.destroy();
    res.redirect('/product-information/grape-varietal')
})

// size CRUD route 
// size index route 
router.get('/size', async function (req, res) {
    let size = (await Size.fetchAll()).toJSON();

    res.render('product_information/size/index', {
        size
    })
})
// size create route 
router.get('/size/create', async function (req, res) {
    const form = sizeForm();
    res.render('product_information/size/create', {
        'form': form.toHTML(bootstrapField)
    })
})
// size create route 
router.post('/size/create', async (req, res) => {
    const form = sizeForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data

            const size = new Size(formData);

            await size.save()

            req.flash("success_messages", `New bottle size ${size.get('name')} has been created`)

            res.redirect('/product-information/size');
        },
        'error': async (form) => {
            res.render('product_information/size/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// size update route 
router.get('/size/:size_id/update', async function (req, res) {
    const size = await Size.where({
        id: req.params.size_id
    }).fetch({
        require: true
    });

    const form = sizeForm();
    form.fields.name.value = size.get('name')
    form.fields.volume.value = size.get('volume')

    res.render('product_information/size/update', {
        form: form.toHTML(bootstrapField),
        size: size.toJSON()
    })
})
// size update route
router.post('/size/:size_id/update', async function (req, res) {
    const size = await Size.where({
        id: req.params.size_id
    }).fetch({
        require: true
    });

    const form = sizeForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data;

            size.set(formData);
            await size.save();

            req.flash("success_messages", `Bottle size ${size.get('name')} has been updated`)

            res.redirect('/product-information/size');
        },
        'error': async (form) => {
            res.render('product_information/size/update', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// size delete route
router.get('/size/:size_id/delete', async function (req, res) {
    const size = await Size.where({
        id: req.params.size_id
    }).fetch({
        require: true
    });
    res.render('product_information/size/delete', {
        size: size.toJSON()
    })
})
// size delete route 
router.post('/size/:size_id/delete', async function (req, res) {
    const size = await Size.where({
        id: req.params.size_id
    }).fetch({
        require: true
    });
    await size.destroy();
    res.redirect('/product-information/size')
})

// product CRUD route 
// product index route 
router.get('/product', async function (req, res) {
    let product = await Product.collection().fetch({
        withRelated: [
            'category',
            'country',
            'region',
            'producer',
            'grape_varietal',
            'size'
        ]
    })
    res.render('product_information/product/index', {
        product: product.toJSON(),
    })
})
// product create route 
router.get('/product/create', async function (req, res) {
    const allCategories = await Category.fetchAll().map(category => {
        return [category.get('id'), category.get('name')]
    });
    const allCountries = await Country.fetchAll().map(country => {
        return [country.get('id'), country.get('name')]
    });
    const allRegions = await Region.fetchAll().map(region => {
        return [region.get('id'), region.get('name')]
    });
    const allProducers = await Producer.fetchAll().map(producer => {
        return [producer.get('id'), producer.get('name')]
    });
    const allSizes = await Size.fetchAll().map(size => {
        return [size.get('id'), size.get('name')]
    });
    const allGrapeVarieties = await GrapeVarietal.fetchAll().map(grapeVarietal => {
        return [grapeVarietal.get('id'), grapeVarietal.get('name')]
    });

    const form = productForm(
        allCategories,
        allCountries,
        allRegions,
        allProducers,
        allSizes,
        allGrapeVarieties
    );

    res.render('product_information/product/create', {
        form: form.toHTML(bootstrapField)
    })
})
// product create route 
router.post('/product/create', async function (req, res) {
    const allCategories = await Category.fetchAll().map(category => {
        return [category.get('id'), category.get('name')]
    });
    const allCountries = await Country.fetchAll().map(country => {
        return [country.get('id'), country.get('name')]
    });
    const allRegions = await Region.fetchAll().map(region => {
        return [region.get('id'), region.get('name')]
    });
    const allProducers = await Producer.fetchAll().map(producer => {
        return [producer.get('id'), producer.get('name')]
    });
    const allSizes = await Size.fetchAll().map(size => {
        return [size.get('id'), size.get('name')]
    });
    const allGrapeVarieties = await GrapeVarietal.fetchAll().map(grapeVarietal => {
        return [grapeVarietal.get('id'), grapeVarietal.get('name')]
    });

    const form = productForm(
        allCategories,
        allCountries,
        allRegions,
        allProducers,
        allSizes,
        allGrapeVarieties
    );

    form.handle(req, {
        'success': async (form) => {

            const product = new Product();

            let { size, grape_varietal, ...restData } = form.data;

            product.set(restData);

            await product.save();

            if (size) {
                console.log(size)
                await product.size().attach(size.split(','))
            }

            if (grape_varietal) {
                console.log(grape_varietal)
                await product.grape_varietal().attach(grape_varietal.split(','))
            }

            req.flash("success_messages", `New product ${product.get('name')} has been created`)

            res.redirect('/product-information/product');
        },
        'error': async (form) => {
            res.render('product_information/product/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// product update route 
router.get('/product/:product_id/update', async function (req, res) {

    const product = await Product.where({
        id: req.params.product_id
    }).fetch({
        require: true,
        withRelated: [
            'category',
            'country',
            'region',
            'producer',
            'size',
            'grape_varietal',
        ]
    });

    const allCategories = await Category.fetchAll().map(category => {
        return [category.get('id'), category.get('name')]
    });
    const allCountries = await Country.fetchAll().map(country => {
        return [country.get('id'), country.get('name')]
    });
    const allRegions = await Region.fetchAll().map(region => {
        return [region.get('id'), region.get('name')]
    });
    const allProducers = await Producer.fetchAll().map(producer => {
        return [producer.get('id'), producer.get('name')]
    });
    const allSizes = await Size.fetchAll().map(size => {
        return [size.get('id'), size.get('name')]
    });
    const allGrapeVarieties = await GrapeVarietal.fetchAll().map(grapeVarietal => {
        return [grapeVarietal.get('id'), grapeVarietal.get('name')]
    });


    const form = productForm(
        allCategories,
        allCountries,
        allRegions,
        allProducers,
        allSizes,
        allGrapeVarieties,
    );

    form.fields.name.value = product.get('name');
    form.fields.description.value = product.get('description');
    form.fields.nose_attribute.value = product.get('nose_attribute');
    form.fields.mouth_attribute.value = product.get('mouth_attribute');
    form.fields.category_id.value = product.get('category_id');
    form.fields.producer_id.value = product.get('producer_id');
    form.fields.country_id.value = product.get('country_id');
    form.fields.region_id.value = product.get('region_id');
    form.fields.alcohol_percentage.value = product.get('alcohol_percentage');
    form.fields.price.value = product.get('price');
    form.fields.stock.value = product.get('stock');
    form.fields.vintage.value = product.get('vintage');
    form.fields.image_url.value = product.get('image_url')

    let selectedSizes = await product.related('size').pluck('id');
    let selectedGrapeVarietals = await product.related('grape_varietal').pluck('id');
    form.fields.size.value = selectedSizes;
    form.fields.grape_varietal.value = selectedGrapeVarietals;



    res.render('product_information/product/update', {
        'form': form.toHTML(bootstrapField),
        'product': product.toJSON(),
    })
})
// product update route 
router.post('/product/:product_id/update', async function (req, res) {

    const product = await Product.where({
        id: req.params.product_id
    }).fetch({
        require: true,
        withRelated: [
            'category',
            'country',
            'region',
            'producer',
            'size',
            'grape_varietal'
        ]
    });

    const allCategories = await Category.fetchAll().map(category => {
        return [category.get('id'), category.get('name')]
    });
    const allCountries = await Country.fetchAll().map(country => {
        return [country.get('id'), country.get('name')]
    });
    const allRegions = await Region.fetchAll().map(region => {
        return [region.get('id'), region.get('name')]
    });
    const allProducers = await Producer.fetchAll().map(producer => {
        return [producer.get('id'), producer.get('name')]
    });
    const allSizes = await Size.fetchAll().map(size => {
        return [size.get('id'), size.get('name')]
    });
    const allGrapeVarieties = await GrapeVarietal.fetchAll().map(grapeVarietal => {
        return [grapeVarietal.get('id'), grapeVarietal.get('name')]
    });


    const form = productForm(
        allCategories,
        allCountries,
        allRegions,
        allProducers,
        allSizes,
        allGrapeVarieties
    );

    form.handle(req, {
        'success': async (form) => {

            let { size, grape_varietal, ...restData } = form.data;

            product.set(restData);

            await product.save();

            let selectedSizesIds = size.split(',');
            let existingSizes = await product.related('size').pluck('id');
            let toRemoveSizes = existingSizes.filter(id => selectedSizesIds.includes(id) === false);

            await product.size().detach(toRemoveSizes);
            await product.size().attach(selectedSizesIds)

            let selectedGrapeVarietalsIds = grape_varietal.split(',');
            let existingGrapeVarietals = await product.related('grape_varietal').pluck('id');
            let toRemoveGrapeVarietals = existingGrapeVarietals.filter(id => selectedGrapeVarietalsIds.includes(id) === false);

            await product.grape_varietal().detach(toRemoveGrapeVarietals);
            await product.grape_varietal().attach(selectedGrapeVarietalsIds)

            req.flash("success_messages", `Product ${product.get('name')} has been updated`)

            res.redirect('/product-information/product');
        },
        'error': async (form) => {
            res.render('product_information/product/update', {
                'form': form.toHTML(bootstrapField),
            })
        }
    })
})
// product delete route
router.get('/product/:product_id/delete', async function (req, res) {
    const product = await Product.where({
        id: req.params.product_id
    }).fetch({
        require: true,
        withRelated: [
            'category',
            'country',
            'region',
            'producer',
            'grape_varietal',
            'size'
        ]
    });
    res.render('product_information/product/delete', {
        product: product.toJSON()
    })
})
//  product delete route 
router.post('/product/:product_id/delete', async function (req, res) {
    const product = await Product.where({
        id: req.params.product_id
    }).fetch({
        require: true,
        withRelated: [
            'category',
            'country',
            'region',
            'producer',
            'grape_varietal',
            'size'
        ]
    });
    await product.destroy();
    res.redirect('/product-information/product')
})

module.exports = router;