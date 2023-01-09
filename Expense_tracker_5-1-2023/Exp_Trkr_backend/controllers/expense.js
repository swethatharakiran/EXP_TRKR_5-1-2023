const Exp=require('../models/expense');


exports.postaddexpense=async(req,res,next)=>{
    try{
    const amount=req.body.amount;
    const desc=req.body.desc;
    const category=req.body.category;
    
    await Exp.create({amount:amount,desc:desc,category:category})
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
        await Exp.destroy({where:{id:id}});
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
        const exp_list=await Exp.findAll();
        console.log('hi')
        res.status(200).json({allexpense:exp_list});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err});
    }

}