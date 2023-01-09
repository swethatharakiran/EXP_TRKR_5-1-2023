const express=require('express');
const Router2=express.Router();
const expensecontroller2=require('../controllers/expense');


Router2.post('/expense/add-expense',expensecontroller2.postaddexpense);
Router2.get('/expense/delete-expense/:id',expensecontroller2.delete_expense);
Router2.get('/expense/edit-expense/:id',expensecontroller2.edit_exp);
Router2.get('/expense/get-expense',expensecontroller2.getexpense);
module.exports=Router2;