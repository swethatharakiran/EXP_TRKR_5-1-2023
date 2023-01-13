const path=require('path');
const express=require('express');
const bodyparser=require('body-parser');
const cors=require('cors');

const app=express();

const sequelize=require('./util/database');
const User=require('./models/user');
const Expense=require('./models/expense');
const Order = require('./models/orders');
const Forgotpassword=require('./models/password');

const expenseroutes=require('./routes/user');
const addexpenseroutes=require('./routes/expense');
const purchaseroutes=require('./routes/purchase');
const premiumfeatureroutes=require('./routes/premiumfeature');
const passwordroutes=require('./routes/password');

const dotenv=require('dotenv');

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(expenseroutes);
app.use(addexpenseroutes);
app.use(purchaseroutes);
app.use(premiumfeatureroutes);
app.use(passwordroutes);

dotenv.config();

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync().then(res=>{
    app.listen(3000);
}).catch(err=>console.log(err));
