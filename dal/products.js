const {
    Category,
    Country,
    Region,
    Producer,
    Size,
    GrapeVarietal,
    Product
} = require('../models');

async function getAllCategories() {
    const allCategories = await Category.fetchAll().map(
        category => [category.get('id'), category.get('name')]
    )
    return allCategories
};

async function getCategoryById(categoryId) {
    return await Category.where({
        'id': categoryId
    }).fetch()
};

async function getAllCountries() {
    const allCountries = await Country.collection().orderBy('name','ASC').fetch().map(
        country => [country.get('id'), country.get('name')]
    )
    return allCountries
};

async function getCountryByID(sizeId) {
    return await Country.where({
        'id': sizeId
    }).fetch()
};

async function getAllRegions() {
    const allRegions = await Region.collection().orderBy('name','ASC').fetch().map(
        region => [region.get('id'), region.get('name')]
    )
    return allRegions
};

async function getRegionByID(regionId) {
    return await Region.where({
        'id': regionId
    }).fetch()
};

async function getAllProducers() {
    const allProducers = await Producer.collection().orderBy('name','ASC').fetch().map(
        producer => [producer.get('id'), producer.get('name')]
    )
    return allProducers
};

async function getProducerById(producerId) {
    return await Producer.where({
        'id': producerId
    }).fetch()
};

async function getAllSizes() {
    const allSizes = await Size.fetchAll().map(
        size => [size.get('id'), size.get('name')]
    )
    return allSizes
};

async function getSizeByID(sizeId) {
    return await Size.where({
        'id': sizeId
    }).fetch()
};

async function getAllGrapeVarietals() {
    const allGrapeVarietals = await GrapeVarietal.collection().orderBy('name','ASC').fetch().map(
        grape => [grape.get('id'), grape.get('name')]
    )
    return allGrapeVarietals
};

async function getGrapeVarietalByID(grapeVarietalId) {
    return await GrapeVarietal.where({
        'id': grapeVarietalId
    }).fetch()
};

async function getAllProducts() {
    return await Product.collection().orderBy('name','ASC').fetch().map(
        product => [product.get('id'), product.get('name')]
    )
};
    
async function getProductById(productId) {
    return await Product.where({
        'id': productId,
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
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getAllCountries,
    getCountryByID,
    getAllRegions,
    getRegionByID,
    getAllProducers,
    getProducerById,
    getAllSizes,
    getSizeByID,
    getAllGrapeVarietals,
    getGrapeVarietalByID,
    getAllProducts,
    getProductById,
}