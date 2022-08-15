const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { User } = require('../models');

const userDAL = require('../dal/users')

const { bootstrapField, registrationForm, loginForm } = require('../forms');

// retrive registration form 
router.get('/register', (req, res) => {

    res.render('users/register', {
        'form': registrationForm().toHTML(bootstrapField)
    })
})
// send data to server to create registration
router.post('/register', async (req, res) => {
    registrationForm().handle(req, {
        'success': async function (form) {

            let user = await userDAL.getUserByEmail(form.data.email)

            if (user) {
                req.flash("error_messages", "This email has been used to create an account. Please login or use another email to register.");
                res.redirect('/user/login')
            } else {
                const newUser = new User({
                    'first_name': form.data.first_name,
                    'last_name': form.data.last_name,
                    'password': getHashedPassword(form.data.password),
                    'email': form.data.email,
                    'user_type_id': 2
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
                res.redirect('/user/login');
            }
        },
        'error': function (form) {
            res.render('users/register', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', (req, res) => {

    res.render('users/login', {
        form: loginForm().toHTML(bootstrapField)
    })

})

router.post('/login', (req, res) => {
    loginForm().handle(req, {
        'success': async function (form) {
            let user = await User.where({
                'email': form.data.email
            }).fetch({
                require: false
            })


            if (!user) {
                console.log(1)
                req.flash('error_messages', "Sorry, your login details are wrong")
                res.redirect('/user/login')
            } else {
                console.log('else')
                if (user.get('user_type_id') == 1 || user.get('user_type_id') == 2) {
                    // FIXED HASHED PASSWORD HERE
                    if (user.get('password') === getHashedPassword(form.data.password)) {
                        req.session.user = {
                            'id': user.get('id'),
                            'first_name': user.get('first_name'),
                            'last_name': user.get('last_name'),
                            'email': user.get('email'),
                            'user_type_id': user.get('user_type_id')
                        }

                        req.flash('success_messages', "You have logged in successfully")
                        res.redirect('/product-information/product')
                    } else {
                        console.log(2)
                        req.flash('error_messages', "Sorry, your login details are wrong")
                        res.redirect('/user/login')
                    }
                } else {
                    console.log(3)
                    req.flash('error_messages', "You are not authorised to access this page");
                    res.redirect('/');
                }
            }
        },
        'error': function (form) {
            res.render('users/login', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.user = null;
    req.flash('success_messages', "You have logged out");
    res.redirect('/user/login');
})

module.exports = router