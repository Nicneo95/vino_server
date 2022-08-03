const bookshelf = require('../bookshelf')

// the name of the model (the first argument, must be capital letter)
const Product = bookshelf.model('Product', {
    tableName:'product'
});

module.exports = { Product };