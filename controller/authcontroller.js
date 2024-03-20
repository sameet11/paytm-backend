const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config')


const {User,Account}=require('../db');
const {signinBody,signupBody,updateBody}=require('../types')

const Signup= async(req,res)=>{
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            error: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            error: "Email already taken/Incorrect inputs"
        })
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstName,
        lastname: req.body.lastName,
    });

    if(!user){
        return res.status(500).json({error:"Database error"})
    }
    const userId = user._id;

    const account=await Account.create({
        user_id:userId,
        Balance:Math.floor(Math.random() * 10000) + 1,
    },)

    if(!account){
        return res.status(500).json({error:"Database error"})
    }
    

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
}
const Signin=async(req,res)=>{
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            error: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
}

const Update=async(req,res)=>{
    const {success}=updateBody.safeParse(req.body);
    if(!success||req.body.username){
        return res.status(404).json({msg:"INVALID INPUTS"});
    }
   const updateUser= await User.updateOne({
    _id:req.userId,
   },req.body);
   
   if(!updateUser){
    return res.status(500).json({msg:"Database Error"});
   }

   return res.status(200).json({msg:"Fields updated successfully"});
}

const Getusers = async (req, res) => {
    try {
        const name = req.query.filter || "";

        const users = await User.find({
            $or: [
                { firstname: { $regex: new RegExp(name, 'i') } },
                { lastname: { $regex: new RegExp(name, 'i') } }
            ]
        });

        if (!users) {
            return res.status(500).json({ error: "Database Error" });
        }
        const filteredUsers = users.filter((user) => user._id != req.userId);
        return res.status(200).json({
            user: filteredUsers.map(user => ({
                username: user.username,
                firstName: user.firstname,
                lastName: user.lastname,
                _id: user._id
            }))
        })
    } catch (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
const CheckUsers=async(req,res)=>{
    const authheader=req.headers.authorization;

    const token=authheader.split(" ")[1];

    try{
        const verify=jwt.verify(token,JWT_SECRET);

        if(verify){
            return res.json({data:"Verified"});
        }
    }
    catch(err){
        return res.json({error:"Not Authorized"})
    }

}
module.exports={
    Signup,
    Signin,
    Update,
    Getusers,
    CheckUsers,
}