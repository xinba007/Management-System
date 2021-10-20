const express = require('express');
const router = new express.Router();
const productController = require('../controller/productController');

router.get('/product', productController.product);
router.get('/addProduct', productController.addProduct);
router.post('/doAddProduct', productController.doAddProduct);

router.get('/removePro', productController.removePro);

router.post('/updatePro', productController.updatePro);

module.exports = router;