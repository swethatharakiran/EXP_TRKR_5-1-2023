const User=require('../models/user');

exports.postsignupform=async(req,res,next)=>{
    
    const username=req.body.username;
    const email=req.body.email;
    const password=req.body.password;

    if(username ==undefined|| username.length===0||email==undefined ||
        email.length===0 || password==undefined||password.length===0){
        res.status(400).json({err:"null parameters , something is not entered"})
    }
    
    await User.create({username:username,email:email,password:password})
    .then(result=>{
        
        res.json({message:"successfully created new user"})
    })
    .catch(err=>{
    res.send(err)
   })
}
    
    
/*exports.postloginform=(req,res,next)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;
    if(email==undefined||email.length===0||password==undefined||password.length===0){
        res.status(400).json({msg:"fields should not be empty"});
    }
    }
    catch(err){console.log(err)}

}*/