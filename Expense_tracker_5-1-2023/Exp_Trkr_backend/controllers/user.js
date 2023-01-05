const User=require('../models/user');

exports.postsignupform=async(req,res,next)=>{
    try{
    const username=req.body.username;
    const email=req.body.email;
    const password=req.body.password;

    if(username ==undefined|| username.length===0||email==undefined ||email.length===0 || password==undefined||password.length===0){
        res.status(400).json({err:"null parameters , something is not entered"})
    }
    else{
    await User.create({username:username,email:email,password:password})
   .then(()=>{res.json({message:"successfully created new user"})})
    }
   }catch(err){
    res.send(err)}

}