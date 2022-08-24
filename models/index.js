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
    product: function () {
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

const User = bookshelf.model('User',{
    tableName: 'user',
    user_type: function () {
        return this.belongsTo('UserType')
    }
})

const UserType = bookshelf.model('UserType',{
    tableName: 'user_type',
    user: function () {
        return this.hasMany('User')
    }
})

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_item',
    product:function(){
        return this.belongsTo('Product')
    },
    user:function(){
        return this.belongsTo('User');
    }
})

const BlacklistedToken = bookshelf.model('BlacklistedToken',{
    tableName: 'blacklisted_token'
})

const Order = bookshelf.model('Order',{
    tableName: 'orders',
    user: function() {
        return this.belongsTo('User')
    },
    order_status: function() {
        return this.belongsTo('OrderStatus')
    },
    order_breakdowns: function() {
        return this.hasMany('OrderBreakdown')
    },
    products: function() {
        return this.belongsToMany('Product');
    }
})

const OrderBreakdown = bookshelf.model('OrderBreakdown', {
    tableName: 'orders_product',
    order: function() {
        return this.belongsTo('Order')
    },
    product: function () {
        return this.belongsTo("Product");
    }
})


const OrderStatus = bookshelf.model('OrderStatus',{
    tableName: 'order_status'
})

module.exports = { 
    Product, 
    Category, 
    Country, 
    Region, 
    Producer, 
    Size, 
    GrapeVarietal, 
    User, 
    UserType, 
    CartItem,
    BlacklistedToken,
    Order,
    OrderBreakdown,
    OrderStatus
};