const express=require('express');
const Router2=express.Router();
const expensecontroller2=require('../controllers/expense');
const expmiddleware=require('../middleware/auth');


Router2.post('/expense/add-expense',expmiddleware.userauthorization,expensecontroller2.postaddexpense);
Router2.get('/expense/delete-expense/:id',expmiddleware.userauthorization,expensecontroller2.delete_expense);
Router2.get('/expense/edit-expense/:id',expensecontroller2.edit_exp);
Router2.get('/expense/get-expense',expmiddleware.userauthorization,expensecontroller2.getexpense);
//Router2.get('/expense/downloadExpenses',expmiddleware.userauthorization,expensecontroller2.downloadExpenses);

module.exports=Router2;