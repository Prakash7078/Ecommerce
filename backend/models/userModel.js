import mongoose from 'mongoose';

//for table in database
const userSchema=new mongoose.Schema(
    {
        //parameters into product table
        name:{type:String,required:true,unique:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        isAdmin:{type:Boolean,default:false,required:true},
       
    },{
        timestamps:true,
    }
);
const User=mongoose.model('User',userSchema);//Product is name of table into db
export default User;