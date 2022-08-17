const { User } = require('../models');

async function getUserByEmail(email) {
    let user = await User.where({
        email
    }).fetch({
        require: false
    })
    return user
}

async function getUserTypeById(userTypeId) {
    return await User.where({
        'id': userTypeId
    }).fetch({
        require: true,
        withRelated: [
            'user_type',
        ]
    })
};

module.exports = {
    getUserByEmail,
    getUserTypeById,
}