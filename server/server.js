const fs = require('fs');
const path = require('path');
const express = require('express');

const multer = require('multer');
const ejs = require('ejs');
const mongoose = require('mongoose');


//DB Config
const db = require('../config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
    .then( () => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const expressLayouts = require("express-ejs-layouts");



// Init app
const app = express();


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({
    extended : false
}));

// Public folder
app.use(express.static('./public'));

/* On défini les routes */

app.use('/', require('../routes/index'));
app.use('/users', require('../routes/users'));

const port = 8080;
app.listen(port, () => console.log('Serveur en route sur le port', port));



    app.post('/upload', (req,res) =>{
       upload(req, res, (err) =>{
           if(err){
               res.render('index', {
                   msg : err
               });
           } else {
                if(req.file === undefined)
                {
                    res.render('index', {
                        msg : 'Erreur : aucun fichier sélectionné'
                    });

                } else {
                    res.render('uploadImage', {
                        msg : 'Fichier uploadé !',
                        file : `uploads/${req.file.originalname}`
                    });

                }
           }
       });
    });



//Set storage engine

    const storage = multer.diskStorage(
        {
            destination:'./public/uploads/',
            filename: function (req, file, cb){
                cb(null, file.originalname); // ici on génère un timestamp sur l'img au cas où il y en aurait qui porterai le même nom
            }
        }
    )

    // Init upload

    const upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb){
            checkFileType(file, cb);
        }
    }).single('myImage');

    //function checkFileType

function checkFileType(file, cb)
{
    // Autorisation des extension

    const filetypes = /jpeg|jpg|png|zip|gif/;
    // on check l'extension

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    //check mime

    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname)
    {
        return cb(null, true)

    }else {
        cb('Erreur : Seules les images sont acceptées')
    }
}





