const checkIfAuthorised = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.user_type_id == 1 || req.session.user.user_type_id == 2) {
            next()
        } else {
            req.flash("error_messages", "Unauthorised access");
            res.redirect('/');
        }
    } else {
        req.flash("error_messages", "Unauthorised access");
        res.redirect('/');
    }
}

module.exports = {
    checkIfAuthorised,
}