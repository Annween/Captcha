const express = require('express');


const router = express.Router();

const bcrypt = require('bcryptjs');
const passport = require('passport');

//user model

const User = require("../Models/user");

//const { ensureAuthenticated } = require('../config/auth');

//Login page
router.get('/connexion', (req, res) =>res.render('connexion'));

//Register page
router.get('/inscription', (req, res) => res.render('inscription'));

//Admin Page
router.get('/adminPage',  (req, res) => res.render('adminPage'));

//Admin Page : contents
router.get('/uploadImage', (req, res) => res.render('uploadImage'));




//Register Handle

router.post('/inscription', (req,res) => {
   const{ name, email, password,password2 } = req.body;
   let errors = [];

   //Check require fields

    if(!name || !email || !password || !password2)
    {
        errors.push({msg: 'Merci de remplir tous les champs'});
    }

    // Check passwords match

    if (password !== password2){
        errors.push({msg: ' Erreur : Les mots de passes de correspondent pas'});
    }

    // Check pass length
    if (password.length < 6 )
    {
        errors.push({msg : 'Erreur : Le mot de passe doit faire au moins 6 caractères'});
    }

    if (errors.length > 0)
    {
        res.render('inscription', {
            errors,
            name,
            email,
            password,
            password2
        });
    }else {
        //Validation de l'inscription
       User.findOne({ email: email})
           .then(user => {
               if(user)
               {
                   //User exists
                   errors.push({msg : 'Cette adresse email a déjà été enregistrée'})
                   res.render('inscription', {
                       errors,
                       name,
                       email,
                       password,
                       password2
                   });

               } else {
                   const newUser = new User({
                       name,
                       email,
                       password
                   });
                   //hash password
                   bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err,hash) => {
                           if(err) throw err;

                           //Set password to hashed
                           newUser.password = hash;
                           //Save user
                            newUser.save()
                                .then( user => {
                                    req.flash('success_msg', 'Vous êtes bien enregistré');
                                    res.redirect('/users/connexion')
                                })
                                .catch(err => console.log(err));
                   }));
               }
           });
    }
});

//Login Handle

router.post('/connexion', (req,res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/adminPage',
        failureRedirect: '/users/connexion',
        failureFlash: true
    })(req, res, next);
});

//Logout handle

router.get('/deconnexion', (req, res) => {
    req.logout();
    req.flash('sucess_msg', 'Vous êtes bien déconnecté');
    res.redirect('/users/connexion');

});

module.exports = router;
