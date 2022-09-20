const express=require('express');
const router=express.Router();
const mainControllers=require('../controllers/main');

router.get('/shop.com',mainControllers.getMain);

module.exports=router;