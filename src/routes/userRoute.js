let express = require('express');
let router = express.Router();
let { login, register, verifyEmail } = require('../controller/userController');
let { getOrder } = require('../controller/orderController');

router.route('/getOrder').get(getOrder);
router.route('/verify-email').get(verifyEmail);
router.route('/register').post(register);
router.route('/login').post(login);
module.exports = router;
