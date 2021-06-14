const fs = require('fs');
const path = require('path');
require('dotenv').config();
const express = require('express');

const multer = require('multer');
const ejs = require('ejs');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");

const Grid = require('gridfs-stream');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const methodOverride = require('method-override');
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

//passport config
require('../config/passport')(passport);

//Mongo URI
const mongoURI = 'mongodb+srv://orianne:orianne@cluster0.n76ka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';


// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

//Create storage engine

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });



// Init app
const app = express();




//Init EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());




//Connect-flash
app.use(flash());

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('sucess_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Public folder
app.use("/public/uploads",express.static(path.join(__dirname, '../public/uploads')));


//@routes

app.get('/', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.render('index', { files: false });
        } else {
            files.map(file => {
                file.isImage = file.contentType === 'image/jpeg' ||
                    file.contentType === 'image/png';
            });
            res.render('index', { files: files });
        }
    });
});
app.use('/', require('../routes/index'));
app.use('/users', require('../routes/users'));



//@route POST /upload
//@desc Uploads file to DB
app.post('/upload', upload.single('file'), (req, res) =>
{
    //res.json({file: req.file });
    res.render('uploadImage', {
        msg : 'Fichier Uploadé'
    })
});

// @route GET/files
// @desc Display all files in JSON
app.get('/files', (req, res) =>{
    gfs.files.find().toArray((err, files) =>{
        //Check if files
        if(!files || files.length === 0){
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        //File exists
        return res.json(files);
    });
});

// @route GET/files/:filename
// @desc Display single file in JSON
app.get('/files/:filename', (req, res) =>{
    gfs.files.findOne({filename: req.params.filename},(err, file) =>{
        //Check if files
        if(!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exist'
            });
        }
        //File exists
        return res.json(file);
    });
});

// @route GET/image/:filename
// @desc Display Image
app.get('/image/:filename', (req, res) =>{
    gfs.files.findOne({filename: req.params.filename},(err, file) =>{
        //Check if files
        if(!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        //Check if image
        if(file.contentType === 'image/jpeg'|| file.contentType === 'image/png'){
            //Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);

        }else {
            res.status(404).json({
                err:'Not an image'
            })
        }
    });
});



const port = 8080;
app.listen(port, () => console.log('Serveur en route sur le port', port));


/*
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
});*/



//Set storage engine

/*const storage = multer.diskStorage(
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
}).single('myImage'); */

//function checkFileType

function checkFileType(file, cb) {
    // Autorisation des extension

    const filetypes = /jpeg|jpg|png|zip|gif/;
    // on check l'extension

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    //check mime

    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true)

    } else {
        cb('Erreur : Seules les images sont acceptées')
    }



}








