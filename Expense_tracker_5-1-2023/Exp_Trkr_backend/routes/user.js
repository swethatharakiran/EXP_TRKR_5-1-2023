const express=require('express');
const Router=express.Router();
const expensecontroller=require('../controllers/user');

Router.post('/user/signup',expensecontroller.postsignupform);

module.exports=Router;