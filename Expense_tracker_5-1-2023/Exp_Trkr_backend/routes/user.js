const express=require('express');
const Router=express.Router();
const expensecontroller=require('../controllers/user');

Router.post('/user/signup',expensecontroller.postsignupform);
Router.post('/user/login',expensecontroller.postloginform);
module.exports=Router;