const checkIfAuthorised = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.user_type_id == 1 || req.session.user.user_type_id == 2) {
            next()
        } else {
            req.flash("error_messages", "Unauthorised access");
            res.redirect('/');
        }
    } 
}

const modifiedUser = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.user_type_id == 1) {
            next()
        } else {
            req.flash("error_messages", "Unauthorised access");
            res.redirect('/product-information/product');
        }
    } 
}

const checkIfAuthenticatedJWT = function(req,res,next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, function(err, payload){
            if (err) {

                return res.sendStatus(403);
            }

            req.user = payload;
            next();
        })
    } else {
        res.sendStatus(403);
    }
}

module.exports = {
    checkIfAuthorised,
    modifiedUser,
    checkIfAuthenticatedJWT
}