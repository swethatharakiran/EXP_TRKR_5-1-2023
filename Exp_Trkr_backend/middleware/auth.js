const jwt=require('jsonwebtoken');
const User=require('../models/user');
const userauthorization=(req,res,next)=>{
    try{
        const token=req.header('Authorization');
        console.log(token);
        console.log(req.headers);
        const user=jwt.verify(token,'secretkey123');
        //console.log(user.id);
        console.log(user.userid);//as stored in token
        User.findByPk((user.userid))
        .then(user=>{
            console.log(JSON.stringify(user));
            req.user=user;
            next();
        }).catch(err=>console.log(err));
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err})
    }
}
module.exports={userauthorization};