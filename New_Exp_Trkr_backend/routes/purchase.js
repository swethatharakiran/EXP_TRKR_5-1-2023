const express=require('express');
const Router3=express.Router();
const expensecontroller3=require('../controllers/purchase');
const expmiddleware=require('../middleware/auth');


Router3.post('/purchase/buymembership',
expmiddleware.userauthorization,expensecontroller3.purchasepremium);

Router3.post('/purchase/updatetransactionstatus',
expmiddleware.userauthorization,expensecontroller3.updatetransaction);

module.exports=Router3;