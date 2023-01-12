const uuid=require('uuid');
const sgmail=require('@sendgrid/mail');
const bcrypt=require('bcrypt');
const User=require('../models/user');
const Forgotpassword=require('../models/password');
//const sequelize = require('../util/database');

exports.forgotpassword=async(req,res)=>{
try{
    const email=req.body.email;
    const user=await User.findOne({where:{email}});
    console.log("FORGOTTT")
    console.log(user);
    if(user){
        const id=uuid.v4();
        user.createForgotpassword({id:id,active:true,userId:user.dataValues.id})
        .catch(err=>{
            throw new Error(err)
        })

        sgmail.setApiKey('  ');// enter sendgrid api key here
        const msg = {
            to: 'swethakh29@gmail.com', 
            from: 'yj.rocks.2411@gmail.com', 
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
        }

        sgmail.send(msg)
        .then((response) => {
            console.log("AFTR SENDING MAIL")
            console.log(response[0].statusCode)
            // console.log(response[0].headers)
            return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

        })
        .catch((error) => {
            throw new Error(error);
        })

        //send mail
    }else {
        throw new Error('User doesnt exist')
    }
} catch(err){
    console.error(err)
    return res.json({ message: err, sucess: false });
}

}




