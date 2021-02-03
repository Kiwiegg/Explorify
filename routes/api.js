var express = require('express');
var router = express.Router();

var login = require('../controllers/login');
var auth = require('../controllers/auth');

router.get("/login", login.get);
router.get("/callback", auth.get);

module.exports = router;