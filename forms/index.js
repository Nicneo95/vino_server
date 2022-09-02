// require in caolan-forms
const forms = require('forms');
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control my-1') === -1) {
        object.widget.classes.push('form-control my-1');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group my-2">' + label + widget + error + '</div>';
};

const categoryForm = () => {
    return forms.create({
        name: fields.string({
            label: 'Category Name',
            required: true,
            errorAfterField: true,
            validators: [
                validators.required("Please enter the name of the category"),
                validators.maxlength(100, "Please enter a name shorter than 100 characters")
            ]
        }),
    })
}

const countryForm = () => {
    return forms.create({
        name: fields.string({
            label: 'Country Name',
            required: true,
            errorAfterField: true,
            validators: [
                validators.required("Please enter the name of the country"),
                validators.maxlength(100, "Please enter a name shorter than 100 characters")
            ]
        }),
    })
}

const producerForm = () => {
    return forms.create({
        name: fields.string({
            label: 'Winery Name',
            required: true,
            errorAfterField: true,
            validators: [
                validators.required("Please enter the name of the winery"),
                validators.maxlength(300, "Please enter a name shorter than 300 characters")
            ]
        }),
        description: fields.string({
            label: 'Winery Description',
            errorAfterField: true,
            widget: widgets.textarea(),
            validators: [validators.maxlength(1000, "Please enter a description shorter than 1000 characters")]
        }),
    })
}

const regionForm = () => {
    return forms.create({
        name: fields.string({
            label: 'Region Name',
            required: true,
            errorAfterField: true,
            validators: [
                validators.required("Please enter the name of the region"),
                validators.maxlength(150, "Please enter a name shorter than 150 characters")
            ]
        }),
    })
}

const sizeForm = () => {
    return forms.create({
        name: fields.string({
            label: 'Bottle Size',
            required: true,
            errorAfterField: true,
            validators: [
                validators.required("Please enter the name of the size"),
                validators.maxlength(255, "Please enter a name shorter than 255 characters")
            ]
        }),
        volume: fields.string({
            label: 'Volume in ml',
            required: true,
            errorAfterField: true,
            validators: [
                validators.required("Please enter the volume"),
                validators.integer("Please enter the volume using numbers"),
                validators.min(0, "Please enter a positive number")
            ]
        })
    })
}

const grapeVarietalForm = () => {
    return forms.create({
        name: fields.string({
            label: 'Grape Varietal',
            required: true,
            errorAfterField: true,
            validators: [
                validators.required("Please enter the name of the region"),
                validators.maxlength(255, "Please enter a name shorter than 255 characters")
            ]
        }),
    })
}

const productForm = (category, country, region, producer, size, grapeVarietal) => {
    return forms.create({
        name: fields.string({
            label: 'Name Of Wine',
            required: true,
            errorAfterField: true,
            validators: [
                validators.required('Input required'),
                validators.maxlength(255, "Exceed input field")
            ]
        }),
        producer_id: fields.string({
            label: 'Producer',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: producer
        }),
        category_id: fields.string({
            label: 'Category',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: category
        }),
        region_id: fields.string({
            label: 'Region',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: region
        }),
        country_id: fields.string({
            label: 'Country',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: country
        }),
        size: fields.string({
            label: 'Size',
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: size
        }),
        grape_varietal: fields.string({
            label: 'Grape Varietal',
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: grapeVarietal
        }),
        nose_attribute: fields.string({
            label: 'Description of nose attributes',
            widget: widgets.textarea(),
            errorAfterField: true,
            validators: [
                validators.maxlength(500, "Exceed input field")
            ]
        }),
        mouth_attribute: fields.string({
            label: 'Description of mouth attributes',
            widget: widgets.textarea(),
            errorAfterField: true,
            validators: [
                validators.maxlength(500, "Exceed input field")
            ]
        }),
        description: fields.string({
            label: 'Wine Description',
            widget: widgets.textarea(),
            errorAfterField: true,
            validators: [
                validators.maxlength(1000, "Exceed input field")
            ]
        }),
        alcohol_percentage: fields.string({
            label: 'Alcohol Percentage',
            errorAfterField: true,
            validators: [
                validators.integer("Invalid input")
            ]
        }),
        price: fields.string({
            label: 'Price in Dollar',
            required: true,
            errorAfterField: true,
            validators: [
                validators.required("Input required"),
                validators.integer("Invalid input"),
                validators.min(0, "Invalid input")
            ]
        }),
        stock: fields.string({
            label: 'Quantity in stock',
            required: true,
            errorAfterField: true,
            validators: [
                validators.required("Input required"),
                validators.integer("Invalid input"),
                validators.min(0, "Invalid input")
            ]
        }),
        vintage: fields.string({
            label: 'Vintage',
            required: true,
            errorAfterField: true,
            validators: [
                validators.required("Input required"),
                validators.integer("Invalid input"),
                validators.min(0, "Invalid input"),
                validators.max(9999, "Invalid input")
            ]
        }),
        image_url: fields.string({
            widget: widgets.hidden()
        }),
        thumbnail_url: fields.string({
            widget: widgets.hidden()
        })
    })
}

const registrationForm = (userType) => {
    return forms.create({
        first_name: fields.string({
            required: true,
            errorAfterField: true,
            validators: [
                validators.required('Input required'),
                validators.maxlength(255, "Exceed input field")
            ]         
        }),
        last_name: fields.string({
            required: true,
            errorAfterField: true,
            validators: [
                validators.required('Input required'),
                validators.maxlength(255, "Exceed input field")
            ]       
        }),
        email: fields.email({
            required: true,
            errorAfterField: true,
            validators: [
                validators.required('Input required'),
                validators.maxlength(320, "Exceed input field")
            ]          
        }),
        password: fields.password({
            required: true,
            errorAfterField: true   
        }),
        confirm_password: fields.password({
            required: true,
            errorAfterField: true,
            validators: [validators.matchField('password')]
        }),
        user_type_id: fields.string({
            label: 'User Type',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: userType
        }),
    })
}

const loginForm = () => {
    return forms.create({
        'email': fields.string({
            'required': true,
            'errorAfterField': true,
            validators: [
                validators.required('Input required'),
                validators.maxlength(320, "Exceed input field")
            ]
        }),
        'password': fields.password({
            'required': true,
            'errorAfterField': true
        })
    })
}

const searchProductForm = (category, country, region, producer, grapeVarietal) => {
    return forms.create({
        search_input: fields.string({
            label: 'Search Input',
            required: false,
            errorAfterField: true
        }),
        min_cost: fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        max_cost: fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        category_id: fields.string({
            label: 'Category',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: category
        }),
        country_id: fields.string({
            label: 'Country',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: country
        }),
        region_id: fields.string({
            label: 'Region',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: region
        }),
        producer_id: fields.string({
            label: 'Producer',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: producer
        }),
        grape_varietal: fields.string({
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: grapeVarietal
        })
    })
}

const searchOrderForm = function (orderStatuses, products) {
    return forms.create({
        'order_status_id': fields.string({
            label: 'Order Status',
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: orderStatuses
        }),
        'products': fields.string({
            label: 'Product',
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: products
        }),
        'min_amount': fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'max_amount': fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
    })
}

const orderForm = (orderStatuses) => {
    return forms.create({
        order_status_id: fields.string({
            label: 'Order Status',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: orderStatuses
        }),
    })
}

module.exports = { 
    bootstrapField, 
    categoryForm, 
    countryForm, 
    producerForm, 
    regionForm, 
    grapeVarietalForm, 
    sizeForm, 
    productForm, 
    registrationForm, 
    loginForm,
    searchProductForm,
    searchOrderForm,
    orderForm
}