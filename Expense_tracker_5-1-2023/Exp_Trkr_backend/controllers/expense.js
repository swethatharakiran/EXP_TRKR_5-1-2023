const Exp=require('../models/expense');
const Downloadedfilesurl=require("../models/downloadedfilesurl");
const jwt=require('jsonwebtoken');
const AWS=require('aws-sdk');
const { v1: uuidv1} = require('uuid');

exports.postaddexpense=async(req,res,next)=>{
    try{
    const amount=req.body.amount;
    const desc=req.body.desc;
    const category=req.body.category;
    
    await Exp.create({amount:amount,desc:desc,category:category,userId:req.user.id})
    //.then((result)=>{res.status(200).json({message:"Successfully added expense"})})
    .then((result)=>{res.status(200).json(result.dataValues)})
      
    .catch(err=>{res.send(err)})
    }
    catch(err){
        console.log(err)
    }


}

exports.delete_expense=async(req,res,next)=>{
    const id=req.params.id;
    try{
        await Exp.destroy({where:{id:id,userId:req.user.id}});
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err});
    }

}

exports.edit_exp=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const exp=await Exp.findByPk(id)
        .then((result)=>{
            res.json(result.dataValues)
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err})
    }
}

exports.getexpense=async(req,res,next)=>{
    try{
        const exp_list=await Exp.findAll({where:{userId:req.user.id}});
         console.log('hi')
        res.status(200).json({allexpense:exp_list});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err});
    }

}

exports.downloadExpenses =  async (req, res) => {

    try {
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
        
        const expenses=await req.user.getExpenses();
        const fileData=JSON.stringify(expenses);
        const fileName=`expenses${req.user.id}/${new Date()}.txt`;
        const S3result=await uploadtoS3(fileData,fileName);//S3result stores file url
        await Downloadedfilesurl.create({fileURL:S3result,userId:req.user.id});// to store downloaded files url in table
        const downloadedfilesurl=await Downloadedfilesurl.findAll({where:{userId:req.user.id}});
        //console.log("FROM DOWNLOADS",downloadedfilesurl);
        res.status(201).json({fileURL:S3result,message:'file uplaod successful',downloadedfilesurl:downloadedfilesurl});
    
    }
        catch(err){
            console.log(err);
            res.status(500).send({message:'interval server error'});
        }
    }
        

    const uploadtoS3=(fileData,fileName)=>{
        const s3=new AWS.S3({
            accessKeyId:'',//amazon aws s3 access key id
            secretAccessKey:''// aws secret access key, its in .env file
        });
        const params={
            Bucket:'khs29expensetracker',
            Key:fileName,
            Body:fileData,
            ACL:'public-read'//who can access
        };
        return new Promise((resolve,reject)=>{
            s3.upload(params,(S3Err,S3Result)=>{
                if(S3Err){
                    console.log("ERR-->",S3Err);
                    reject(S3Err);
                }
            
            console.log("--->",S3Result);
              resolve(S3Result.Location);
            })
        })
    }