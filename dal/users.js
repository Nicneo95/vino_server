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

module.exports = {
    getUser,
    getAllUserTypes,
    getUserByID,
}