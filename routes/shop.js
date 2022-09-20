const express=require('express');
const router=express.Router();
const shopControllers=require('../controllers/shop');
const isAuth=require('../middleware/is-auth');


router.get('/home',isAuth,shopControllers.postHome);
router.get('/getProducts',isAuth,shopControllers.getProducts);
router.get('/search',isAuth,shopControllers.searchKey);

module.exports=router;