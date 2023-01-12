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

        sgmail.setApiKey(' ');// enter sendgrid api key here
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


exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

exports.updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}




