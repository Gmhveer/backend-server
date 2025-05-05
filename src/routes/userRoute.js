let express = require('express');
let router = express.Router();
let { login, register } = require('../controller/userController');
let {getOrder} = require('../controller/orderController');
router.route('/getOrder').get(getOrder);
router.route('/create_user').post(register);
router.route('/login').post(login);
module.exports = router;
