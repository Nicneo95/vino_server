const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userDAL = require('../../dal/users')
const { checkIfAuthenticatedJWT } = require('../../middlewares')

const generateToken = ( user, secret, expiry) => {
    // three arguments:
    // arg 1: JWT payload
    // arg 2: token secret
    // arg 3: configuration object
    return jwt.sign({
        'first_name': user.first_name,
        'last_name' : user.last_name,
        'id': user.user_id,
        'email': user.email,
        'user_type_id' : user.user_type_id
    }, secret, {
        'expiresIn': expiry 
    });
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.post('/login', async (req, res) => {
    const user = await userDAL.getUserByEmail(req.body.email)
    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        const accessToken = generateToken(user.toJSON(), process.env.TOKEN_SECRET, '1h')
       
        res.send({
            accessToken,
           
        })
    } else {
        res.sendStatus(401)
    }
});

router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user
    res.send(user)
});

module.exports = router;