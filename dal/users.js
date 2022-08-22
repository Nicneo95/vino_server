const { User, UserType } = require('../models');

async function getUserByID(userId) {
    return await User.where({
        'id': userId
    }).fetch({
        require: true,
        withRelated: [
            'user_type',
        ]
    });
};

async function getUser() {
    return await User.collection().fetch({
        require: true,
        withRelated: [
            'user_type',
        ]
    });
}

async function getAllUserTypes() {
    const allUserTypes = await UserType.fetchAll().map(
        userType => [userType.get('id'), userType.get('name')]
    )
    return allUserTypes
};

async function getUserByEmail(email) {
    let user = await User.where({
        email
    }).fetch({
        require: false
    })
    return user
};

module.exports = {
    getUser,
    getAllUserTypes,
    getUserByID,
    getUserByEmail
}