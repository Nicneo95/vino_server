const cartDAL = require('../dal/cart_items');
const productDAL = require('../dal/products')

class CartServices {
    constructor(userId) {
        this.userId = userId
    }

    async getCart() {
        return await cartDAL.getCart(this.userId)
    }

    async addToCart(productId, quantity) {

        let product = await productDAL.getProductById(parseInt(productId))
        let currentStock = product.get('stock')
        // check if the user has added the product to the shopping cart 
        let cartItem = await cartDAL.getCartItemByUserAndProduct(this.userId, productId)
        // product already in user cart, and sufficient stock
        if (cartItem && currentStock >= cartItem.get('quantity') + quantity) {
            await cartDAL.updateCartItemQuantity(
                this.userId,
                productId,
                cartItem.get('quantity') + quantity
            )
            return "You have added this item to your cart successfully"
            //product already in user's cart but insufficient stock
        } else if (cartItem && currentStock < cartItem.get('quantity') + quantity) {

            return `Only ${currentStock} of this item left`

            //product not in user cart, and sufficient stock
        } else if (!cartItem && currentStock >= quantity) {

            cartItem = await cartDAL.createCartItem(
                this.userId,
                productId,
                quantity
            )

            return "You have added this item to your cart succesfully";

            //product not yet in user cart and insufficient stock
        } else if (!cartItem && currentStock < quantity) {

            cartItem = await cartDAL.createCartItem(
                this.userId,
                productId,
                currentStock
            )
            return "There is insufficient stock for the quantity you selected. Your cart has been updated"
        }
    }

    async updateQuantity(productId, newQuantity) {
        let product = await productDAL.getProductById(productId)

        if (product.get('stock') >= newQuantity) {
            await cartDAL.updateCartItemQuantity(this.userId, productId, newQuantity);
            return true
        } else {
            return false
        }
    }

    async removeFromCart(productId) {
        await cartDAL.removeFromCart(this.userId, productId);
    }

    async stockCheck() {
        let cartItems = await cartDAL.getCart(this.userId)

        let insufficientStockItems = cartItems.filter(
            cartItem => cartItem.related('product').get('stock') < cartItem.get('quantity')
        )

        if (insufficientStockItems.length > 0) {
            insufficientStockItems.map(
                // item is CartItem, not Product!!!!!!
                async item => {
                    let quantityInStock = item.related('product').get('stock')

                    quantityInStock ?

                        await cartDAL.updateCartItemQuantity(this.userId, item.related('product').get('id'), quantityInStock) : await cartDAL.removeFromCart(this.userId, item.related('product').get('id'))
                }
            )
        }
        return insufficientStockItems
    }

}

module.exports = CartServices;