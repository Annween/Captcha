module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated){
            return next;

        }
        req.flash('error_msg', 'Merci de vous connectez pour voir cette page');
        res.redirect('/users/connexion');

    },

    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }
};
