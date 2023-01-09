const User=require('../models/user');
const bcrypt=require('bcrypt');
const saltrounds=10;

exports.postsignupform=async(req,res,next)=>{
    
    const username=req.body.username;
    const email=req.body.email;
    const password=req.body.password;

    if(username ==undefined|| username.length===0||email==undefined ||
        email.length===0 || password==undefined||password.length===0){
        res.status(400).json({err:"null parameters , something is not entered"})
    }
    bcrypt.hash(password,saltrounds,async(err,hash)=>{
        if(err){
            console.log(err);
        }
        else{
            await User.create({username:username,email:email,password:hash})
            .then(()=>{
            res.json({message:"successfully created new user"})
           })
         .catch(err=>{
         res.send(err)
          })
         }
      })
        
}
    
exports.postloginform=(req,res,next)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;
    if(email==undefined||email.length===0||password==undefined||password.length===0){
        res.status(400).json({message:"fields should not be empty"});
    }
    else{
        User.findAll({where:{email:email}}).then(user=>{
            if(user[0].email==email)
            {
                console.log(user[0].password);//from database
                bcrypt.compare(password,user[0].password,async(err,result)=>{
                    if(err){
                        throw new Error("something went wrong");
                    }
                    else{
                        if(result===true){
                            res.status(200).json({message:"login successful"})
                        }
                        else{
                            res.status(400).json({message:"password incorrect/user not authorized"})
                        }
                    }
                })                       
            }
            else{
                res.status(404).json({message:"user does not exist"})
            }
        }).catch(err=>res.status(500).json({message:"error and mostly user does not exist"}));
    }
    }
    catch(err){console.log(err)}

}

