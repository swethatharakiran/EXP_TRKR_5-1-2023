const Exp=require('../models/expense');
const jwt=require('jsonwebtoken');
const { BlobServiceClient } = require('@azure/storage-blob');
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
        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING; //  Never push it to github.
        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        
        const containerName = 'swethakh29gmailexpensetracker'; //this needs to be unique name

        console.log('\nCreating container...');
        console.log('\t', containerName);

        // Get a reference to a container
        const containerClient = await blobServiceClient.getContainerClient(containerName);

        //check whether the container already exists or not
        if(!containerClient.exists()){
            // Create the container if the container doesnt exist
            const createContainerResponse = await containerClient.create({ access: 'container'});
            console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
        }
        // Create a unique name for the blob
        const blobName = 'expenses' + uuidv1() + '.txt';

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        console.log('\nUploading to Azure storage as blob:\n\t', blobName);

        // Upload data to the blob as a string
        const data =  JSON.stringify(await req.user.getExpenses());

        const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
        console.log("Blob was uploaded successfully. requestId: ", JSON.stringify(uploadBlobResponse));

        //We send the fileUrl so that the in the frontend we can do a click on this url and download the file
        const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
        res.status(201).json({ fileUrl, success: true}); // Set disposition and send it.
    } catch(err) {
        res.status(500).json({ error: err, success: false, message: 'Something went wrong'})
    }

};

