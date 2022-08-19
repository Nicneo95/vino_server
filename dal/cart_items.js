const {
    CartItem
} = require('../models');

//all cart items by specific user
async function getCart(userId){
    return await CartItem.collection()
    .where({'user_id': userId})
    .fetch({
        require:false,
        withRelated : ['product']
    })
}

//specific item in cart of specific user
async function getCartItemByUserAndProduct(userId, productId) {
    return await CartItem.where({
        'user_id': userId,
        'product_id': productId
    }).fetch({
        'require': false
    })
}

async function createCartItem(userId, productId, quantity) {

    let cartItem = new CartItem({
        'user_id': userId,
        'product_id': productId,
        'quantity': quantity
    });

    await cartItem.save(); 
    return cartItem;
}

async function updateCartItemQuantity(userId, productId, quantity) {
    
    let cartItem = await getCartItemByUserAndProduct(userId, productId);
    cartItem.set('quantity', quantity);
    
    await cartItem.save();
    console.log(cartItem.toJSON())
    return cartItem;
}

async function removeFromCart(userId, productId) {
    let cartItem = await getCartItemByUserAndProduct(userId, productId);
    await cartItem.destroy();
}


module.exports = { 
    getCart, 
    getCartItemByUserAndProduct,
    createCartItem,
    updateCartItemQuantity,
    removeFromCart

}