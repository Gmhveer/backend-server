let express = require('express');
let router = express.Router();
let { addProduct, updateProduct, getProducts } = require('../controller/productController');

router.route('/getProducts').get(getProducts);
router.route('/addProduct').post(addProduct);
router.route('/updateProduct/:id').put(updateProduct);
module.exports = router;
