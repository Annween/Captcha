const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//User model
const User = require('../Models/user')

module.exports = function (passport){
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            // Match user
            User.findOne({email: email})
                .then(user => {
                    if (!user) {
                        return done(null, false, {message: " Erreur : Cette adresse mail n'est pas enregistrée"});
                    }

                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch){
                            return done(null, user);
                        }else {
                            return done(null, false, { message : 'Erreur : mot de passe incorrect '})
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) =>{
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}
