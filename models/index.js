const bookshelf = require('../bookshelf')

const Category = bookshelf.model('Category', {
    tableName: 'category'
});

const Country = bookshelf.model('Country', {
    tableName: 'country'
});

const Region = bookshelf.model('Region', {
    tableName: 'region'
});

const Producer = bookshelf.model('Producer', {
    tableName: 'producer'
});

const Size = bookshelf.model('Size', {
    tableName: 'size',
    products: function () {
        return this.belongsToMany('Product')
    }
});

const GrapeVarietal = bookshelf.model('GrapeVarietal', {
    tableName: 'grape_varietal',
    product: function () {
        return this.belongsToMany('Product')
    }
});

const Product = bookshelf.model('Product', {
    tableName: 'product',
    category: function () {
        return this.belongsTo('Category')
    },
    country: function () {
        return this.belongsTo('Country')
    },
    region: function () {
        return this.belongsTo('Region')
    },
    producer: function () {
        return this.belongsTo('Producer')
    },
    size: function () {
        return this.belongsToMany('Size');
    },
    grape_varietal: function () {
        return this.belongsToMany('GrapeVarietal');
    }
});

module.exports = { Product, Category, Country, Region, Producer, Size, GrapeVarietal };