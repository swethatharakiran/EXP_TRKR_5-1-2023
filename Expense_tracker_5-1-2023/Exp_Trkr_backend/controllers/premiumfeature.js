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
        
              
      
        //userleaderboarddetails.sort((a,b)=>b.total-a.total)
        
        res.status(200).json(usersleaderboard);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err});
    }
}