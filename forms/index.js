// require in caolan-forms
const forms = require('forms');
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
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


const productForm = (category, country, region, producer, grapeVarietal, size) => {
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
            label: 'Origin Country',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: country
        }),
        grape_varietal: fields.string({
            label: 'Grape Varietal',
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: grapeVarietal
        }),
        size: fields.string({
            label: 'Size',
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: size
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
                validators.maxlength(10, "Exceed input field")
            ]
        }),
        price: fields.string({
            label: 'Price in cents',
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

module.exports = { bootstrapField, categoryForm, countryForm, producerForm, regionForm, grapeVarietalForm, sizeForm, productForm, }