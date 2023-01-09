const express=require('express');
const bodyparser=require('body-parser');
const cors=require('cors');

const app=express();

const sequelize=require('./util/database');
const User=require('./models/user');
const Expense=require('./models/expense');
const expenseroutes=require('./routes/user');
const addexpenseroutes=require('./routes/expense');

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(expenseroutes);
app.use(addexpenseroutes);

sequelize.sync().then(res=>{
    app.listen(3000);
}).catch(err=>console.log(err));
