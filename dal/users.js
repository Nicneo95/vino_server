const { User } = require('../models');

async function getUserByEmail(email) {
    let user = await User.where({
        email
    }).fetch({
        require: false
    })
    return user
}

module.exports = {
    getUserByEmail
}