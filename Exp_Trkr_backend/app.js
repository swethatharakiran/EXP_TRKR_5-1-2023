const path=require('path');
const express=require('express');
const bodyparser=require('body-parser');
const cors=require('cors');
const helmet=require('helmet');
const morgan=require('morgan');
const fs=require('fs');
const https=require('https');

const app=express();
const dotenv=require('dotenv');
dotenv.config();
const sequelize=require('./util/database');
const User=require('./models/user');
const Expense=require('./models/expense');
const Order = require('./models/orders');
const Forgotpassword=require('./models/password');
const Downloadedfilesurl=require('./models/downloadedfilesurl');


const expenseroutes=require('./routes/user');
const addexpenseroutes=require('./routes/expense');
const purchaseroutes=require('./routes/purchase');
const premiumfeatureroutes=require('./routes/premiumfeature');
const passwordroutes=require('./routes/password');
const accesslogstream=fs.createWriteStream(path.join(__dirname,'access.log'));

//const privateKey=fs.readFileSync('server.key');
//const certificate=fs.readFileSync('server.cert');

app.use(helmet());
app.use(morgan('combined',{stream:accesslogstream}));



app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(expenseroutes);
app.use(addexpenseroutes);
app.use(purchaseroutes);
app.use(premiumfeatureroutes);
app.use(passwordroutes);



User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Downloadedfilesurl);
Downloadedfilesurl.belongsTo(User);
//console.log("-->APP",process.env.PORT);


sequelize.sync().then(res=>{
    //https.createServer(
        //{key:privateKey,cert:certificate},app).listen(3000);
    app.listen(process.env.PORT);
}).catch(err=>console.log(err));
