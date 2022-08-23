const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { BlacklistedToken } = require('../../models')
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
        const refreshToken = generateToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, '1d')
       
        res.send({
            accessToken,
            refreshToken, 
        })
    } else {
        res.sendStatus(401)
    }
});

router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user
    res.send(user)
});

router.post('/refresh', async (req, res) => {
    let refreshToken = req.body.refreshToken
    let blacklistedToken = await BlacklistedToken.where({
        token: refreshToken
    }).fetch({
        require: false
    })

    if (!refreshToken) {
        res.sendStatus(401)
    } else if (blacklistedToken) {
        res.status(401)
        return res.send('Please log in again.')
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            let accessToken = generateToken(user, process.env.TOKEN_SECRET, '1h')
            res.send({
                accessToken
            })
        })
    }
});

router.post('/logout', async (req, res) => {
    let refreshToken = req.body.refreshToken
    if (!refreshToken) {
        res.sendStatus(401)
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            const blacklistedToken = new BlacklistedToken()
            blacklistedToken.set('token', refreshToken)
            blacklistedToken.set('date_created', new Date())
            await blacklistedToken.save()
            res.send({
                message: 'Successfully logged out'
            })
        })
    }
});





module.exports = router;