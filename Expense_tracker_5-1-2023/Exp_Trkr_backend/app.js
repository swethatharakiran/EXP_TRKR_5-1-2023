const express=require('express');
const bodyparser=require('body-parser');
const cors=require('cors');

const app=express();

const sequelize=require('./util/database');
const Expense=require('./models/user');
const expenseroutes=require('./routes/user');

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(expenseroutes);

sequelize.sync().then(res=>{
    app.listen(3000);
}).catch(err=>console.log(err));
