const mongoose=require('mongoose');

const {Account}=require('../db');
const {transferBody}=require('../types')

const Getbalance=async(req,res)=>{
    const account= await Account.findOne({
        user_id:req.userId,
    })
    if(!account){
        return res.status(500).json({error:"Database Error"})
    }
    return res.status(200).json({Balance:account.Balance})
}

const transferMoney=async(req,res)=>{
    const {success}=transferBody.safeParse(req.body);
    if(!success){
        return res.status(400).json({error:"INVALID OUTPUT"});
    }
    const session=await mongoose.startSession();
    session.startTransaction();
    const userAcc= await Account.findOne({
        user_id:req.userId,
    }).session(session);

    if(!userAcc||userAcc.Balance<req.body.amount){
        await session.abortTransaction();
        return res.status(400).json({error:"Insufficient balanace"});
    }

    const sendAcc= await Account.findOne({
        user_id:req.body.to,
    }).session(session)

    if(!sendAcc){
        await session.abortTransaction();
        return res.status(400).json({error:"Wrong user"});
    }

    const deductuser=await Account.updateOne({
        user_id:req.userId,
    },{$inc:{
        Balance:-req.body.amount,
    }}).session(session)
    if(!deductuser){
        await session.abortTransaction();
        return res.status(500).json({error:"Database Error"});
    }
    const Adduser=await Account.updateOne({
        user_id:req.body.to,
    },{$inc:{
        Balance:req.body.amount,
    }}).session(session)
    if(!Adduser){
        await session.abortTransaction();
        return res.status(500).json({error:"Database Error"});
    }

    await session.commitTransaction();
    return res.status(200).json({data:"money transferred successfully"})
}

module.exports={
    Getbalance,
    transferMoney,
}