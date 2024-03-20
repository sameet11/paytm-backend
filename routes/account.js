const express=require('express');

const {Getbalance,transferMoney}=require('../controller/accountcontroller')

const authMiddleware=require('../middlewares/authmiddleware');
const router=express.Router();

router.get('/balance',authMiddleware,Getbalance)
router.post('/transfer',authMiddleware,transferMoney);
module.exports=router;