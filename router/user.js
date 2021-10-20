const express = require('express');
const router = new express.Router();
const userController = require('../controller/userController.js');

router.get('/index', userController.index)
router.get('/addIndex', userController.addIndex)

router.get('/login', userController.login)
router.post('/doLogin', userController.doLogin)

router.get('/sign', userController.sign)
router.post('/doSign', userController.doSign)

router.get('/error', userController.error)

router.get('/remove', userController.remove)
router.post('/update', userController.update)
router.post('/add', userController.add)

router.get('/search', userController.search)
router.get('/searchIndex', userController.searchIndex)

module.exports = router;