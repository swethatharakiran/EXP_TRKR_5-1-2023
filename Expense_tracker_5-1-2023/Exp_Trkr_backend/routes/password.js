const express=require('express');
const Router5=express.Router();
const passwordcontroller=require('../controllers/password');
//const expmiddleware=require('../middleware/auth');


Router5.post('/password/forgotpassword',
passwordcontroller.forgotpassword);
Router5.get('/password/resetpassword/:id',
passwordcontroller.resetpassword);
Router5.get('/password/updatepassword/:resetpasswordid',
passwordcontroller.updatepassword);


module.exports = Router5