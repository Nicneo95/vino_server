const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { User } = require('../models');

const userDAL = require('../dal/users');

const { bootstrapField, registrationForm } = require('../forms');

// user CRUD route
// user index route 
router.get('/', async function (req, res) {
    const user = await userDAL.getUser()
    
    res.render('users/index', {
        user: user.toJSON(),
    })
});
// user create route 
router.get('/create', async function (req, res) {

    const allUserTypes = await userDAL.getAllUserTypes()
    
    const form = registrationForm(allUserTypes);

    res.render('users/create', {
        form: form.toHTML(bootstrapField)
    })
});
// user create route
router.post('/create', async (req, res) => {
    const form = registrationForm();

    form.handle(req, {
        'success': async (form) => {
            let { ...formData } = form.data

            const user = new User({
                'first_name': form.data.first_name,
                'last_name': form.data.last_name,
                'password': getHashedPassword(form.data.password),
                'email': form.data.email,
                'user_type_id': form.data.user_type_id
            });

            await user.save()

            req.flash("success_messages", `New user ${user.get('email')} has been created`)

            res.redirect('/user');
        },
        'error': async (form) => {
            res.render('user', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
// product delete route
router.get('/:user_id/delete', async function (req, res) {
    const user = await userDAL.getUserByID(req.params.user_id)

    res.render('users/delete', {
        user: user.toJSON()
    })
})
//  product delete route 
router.post('/:user_id/delete', async function (req, res) {
    const user = await userDAL.getUserByID(req.params.user_id)

    await user.destroy();
    res.redirect('/user')
})
 
module.exports = router