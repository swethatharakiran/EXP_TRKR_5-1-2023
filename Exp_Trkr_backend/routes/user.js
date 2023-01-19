const express=require('express');
const Router=express.Router();
const usercontroller=require('../controllers/user');
const expmiddleware=require('../middleware/auth');
const expensecontroller=require('../controllers/expense')

Router.post('/signup',usercontroller.postsignupform);
Router.post('/login',usercontroller.postloginform);
Router.get('/download', expmiddleware.userauthorization, expensecontroller.downloadExpenses);

module.exports=Router;