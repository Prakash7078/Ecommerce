import mongoose from 'mongoose';

//for table in database
const productSchema=new mongoose.Schema(
    {
        //parameters into product table
        name:{type:String,required:true,unique:true},
        slug:{type:String,required:true,unique:true},
        category:{type:String,required:true},
        image:{type:String,required:true},
        price:{type:Number,required:true},
        countInStock:{type:Number,required:true},
        brand:{type:String,required:true},
        rating:{type:Number,required:true},
        numReviews:{type:Number,required:true},
        description:{type:String,required:true},
       
    },{
        timestamps:true,
    }
);
const Product=mongoose.model('Product',productSchema);//Product is name of table into db
export default Product;