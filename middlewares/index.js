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

module.exports = {
    checkIfAuthorised,
    modifiedUser,
}