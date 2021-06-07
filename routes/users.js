const express = require('express');
const router = express.Router();

//Login page
router.get('/connexion', (req, res) =>res.render('connexion'));

//Register page
router.get('/inscription', (req, res) => res.render('inscription'));
module.exports = router;
