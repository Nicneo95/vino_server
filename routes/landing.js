const express = require('express');
const router = express.Router(); // create a new express router
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { bootstrapField, loginForm } = require('../forms');

const { User } = require('../models');

const userDAL = require('../dal/users');

// add a new route to the express router
router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/product-information/product')
    } else {
        res.redirect('/login')
    }
})

router.get('/login', (req, res) => {

    res.render('landing/login', {
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
                req.flash('error_messages', "Sorry, your login details are wrong")
                res.redirect('/login')
            } else {
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
                        req.flash('error_messages', "Sorry, your login details are wrong")
                        res.redirect('/login')
                    }
                } else {
                    req.flash('error_messages', "You are not authorised to access this page");
                    res.redirect('/login');
                }
            }
        },
        'error': function (form) {
            res.render('landing/login', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.user = null;
    req.flash('success_messages', "You have logged out");
    res.redirect('/login');
})

module.exports = router; // export out the router
