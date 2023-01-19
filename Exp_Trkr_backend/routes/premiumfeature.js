const express=require('express');
const Router4=express.Router();
const premiumcontroller=require('../controllers/premiumfeature');
const expmiddleware=require('../middleware/auth');


Router4.get('/premium/showleaderboard',
expmiddleware.userauthorization,premiumcontroller.getuserleaderboard);

module.exports=Router4;