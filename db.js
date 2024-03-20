const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI=process.env.MONGODB_URI
mongoose.connect(MONGODB_URI,)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    }
})
const AccountSchema=new mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",
required:true,},
    Balance:{
        type:Number,
        required:true,
    }
})
const User = mongoose.model('User', userSchema);
const Account=mongoose.model('Account',AccountSchema);

module.exports = {User,Account};