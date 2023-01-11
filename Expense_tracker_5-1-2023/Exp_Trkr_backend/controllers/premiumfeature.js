const User=require('../models/user');
const Exp=require('../models/expense');

exports.getuserleaderboard=async(req,res,next)=>{
    try{
        const users=await User.findAll();
        const expenses=await Exp.findAll();
        const useraggregateexpenses={};
        console.log("FROM CONTROLLER");
        //console.log(expenses)
        expenses.forEach(expense=>{
            //console.log("FROM FOREACH LOOP")
            //console.log(expense.dataValues.userId);
            if(useraggregateexpenses[expense.dataValues.userId]){
                useraggregateexpenses[expense.dataValues.userId]+=expense.amount;
            }
            else{
                useraggregateexpenses[expense.dataValues.userId]=expense.amount;
            }
        })
        var userleaderboarddetails=[];
        users.forEach(user=>{
            //console.log("USER DETAILS");
            //console.log(user);
            userleaderboarddetails.push({name:user.dataValues.username,total:useraggregateexpenses[user.dataValues.id]||0});
            //console.log(user.dataValues.username);
            //console.log(useraggregateexpenses[user.dataValues.id])
        })
        //console.log(useraggregateexpenses);
        userleaderboarddetails.sort((a,b)=>b.total-a.total)
        res.status(200).json(userleaderboarddetails);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err});
    }
}