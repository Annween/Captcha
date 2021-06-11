const express = require('express');
const router = express.Router();
const GridFsStorage = require('multer-gridfs-storage');

router.get('/', (req, res) => res.render('index'));



module.exports = router;


