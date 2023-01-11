const User=require('../models/user');
const Exp=require('../models/expense');
const sequelize = require('../util/database');

exports.getuserleaderboard=async(req,res,next)=>{
    try{
        const usersleaderboard=await User.findAll({
            attributes:[
                'id',
            'username',
            [sequelize.fn('sum',sequelize.col('expenses.amount')),'total']
             ], //optimization-choosing selected fields from table
            include:[
                {
                    model:Exp,
                    attributes:[]

                }
            ],
                group:['user.id'],
                order:[['total','desc']]
            
        });
        
       // const useraggregateexpenses={};
        //console.log("FROM CONTROLLER");
        //console.log(expenses)
        //expenses.forEach(expense=>{
            //console.log("FROM FOREACH LOOP")
            //console.log(expense.dataValues.userId);
           // if(useraggregateexpenses[expense.dataValues.userId]){
             //   useraggregateexpenses[expense.dataValues.userId]+=expense.amount;
            //}
            //else{
              //  useraggregateexpenses[expense.dataValues.userId]=expense.amount;
            //}
        //})
        //var userleaderboarddetails=[];
       // users.forEach(user=>{
            
            //userleaderboarddetails.push({name:user.dataValues.username,total:useraggregateexpenses[user.dataValues.id]||0});
            
       // })
      
        //userleaderboarddetails.sort((a,b)=>b.total-a.total)
        res.status(200).json(usersleaderboard);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err});
    }
}