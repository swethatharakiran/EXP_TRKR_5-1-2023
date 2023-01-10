const Order=require('../models/orders');
const Razorpay=require('razorpay');
const jwt=require('jsonwebtoken');
require('dotenv').config();

exports.purchasepremium=async(req,res,next)=>{
    try{
    var rzp=new Razorpay({
    key_id:'rzp_test_hLNCyRO3lfUZpZ',
    key_secret:'LFOXSlxbI6syn9ZxmrSBlA3A'
})
const amount=3000;
rzp.orders.create({amount,currency:'INR'},(err,order)=>{
    if(err){
        throw new Error(JSON.stringify(err));
    }
    req.user.createOrder({orderid:order.id,status:'PENDING'})
    .then(()=>{
         res.status(201).json({order,key_id:rzp.key_id});
    }).catch(err=>{throw new Error(err)})
})
    }
    catch(err){
        console.log(err);
    }
}

exports.updatetransaction=async(req,res,next)=>{
    try{
        console.log(req.body);
        const paymentid=req.body.paymentid;
        const orderid=req.body.orderid;
        const order=await Order.findOne({where:{orderid:orderid}})
        
        const promise1= order.update({paymentid:paymentid,status:'SUCCESSFULL'})
        const promise2= req.user.update({ispremiumuser:true})
        Promise.all([promise1,promise2]).then(()=>{
            return res.status(202).json({success:true,message:'Transaction successful'})
        }).catch(err=>{
            throw new Error(err);
        })           
    }
    catch(err){
        console.log(err);
        res.json({error:err,message:'Something went wrong'});
    }
}