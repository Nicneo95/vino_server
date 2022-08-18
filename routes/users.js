const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { User, UserType } = require('../models');

const userDAL = require('../dal/users');

const { bootstrapField, registrationForm } = require('../forms');

// user CRUD route
// user index route 
router.get('/', async function (req, res) {
    const user = await User.collection().fetch({
        require: true,
        withRelated: [
            'user_type',
        ]
    });

    res.render('users/index', {
        user: user.toJSON(),
    })
});
// user create route 
router.get('/create', async function (req, res) {

    const userType = await UserType.fetchAll().map(
        userType => [userType.get('id'), userType.get('name')]
    )

    const form = registrationForm(userType);

    res.render('users/create', {
        form: form.toHTML(bootstrapField)
    })
});
// user create route
router.post('/create', async (req, res) => {
    registrationForm().handle(req, {
        'success': async function (form) {

            let user = await userDAL.getUserByEmail(form.data.email)

            if (user) {
                req.flash("error_messages", "This email has been used to create an account. Please login or use another email to register.");
                res.redirect('/user')
            } else {
                const newUser = new User({
                    'first_name': form.data.first_name,
                    'last_name': form.data.last_name,
                    'password': getHashedPassword(form.data.password),
                    'email': form.data.email,
                    'user_type_id': form.data.user_type_id
                });
                await newUser.save();
                req.session.user = {
                    'id': newUser.get('id'),
                    'first_name': newUser.get('first_name'),
                    'last_name': newUser.get('last_name'),
                    'email': newUser.get('email'),
                    'user_type_id': newUser.get('user_type_id')
                }
                req.flash("success_messages", "You have registered successfully");
                res.redirect('/user');
            }
        },
        'error': function (form) {
            res.render('users/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// product delete route
router.get('/:user_id/delete', async function (req, res) {
    const user = await User.where({
        id: req.params.user_id
    }).fetch({
        require: true,
        withRelated: [
            'user_type',
        ]
    });
    res.render('users/delete', {
        user: user.toJSON()
    })
})
//  product delete route 
router.post('/:user_id/delete', async function (req, res) {
    const user = await User.where({
        id: req.params.user_id
    }).fetch({
        require: true,
        withRelated: [
            'user_type',
        ]
    });
    await user.destroy();
    res.redirect('/user')
})
 
module.exports = router