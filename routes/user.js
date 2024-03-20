const express =require('express')
const router=express.Router();
const {Signup,Signin,Update,Getusers,CheckUsers}=require('../controller/authcontroller')
const authMiddleware=require('../middlewares/authmiddleware');

router.post('/signup',Signup);
router.post('/signin',Signin);
router.put('/',authMiddleware,Update);
router.get('/bulk',authMiddleware,Getusers)
router.get('/me',CheckUsers)
module.exports=router;