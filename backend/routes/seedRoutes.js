import express from 'express';
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const seedRouter=express.Router();
//for add from data.js into database
seedRouter.get('/',async(req,res)=>{
    await Product.remove({});
    const createdProducts=await Product.insertMany(data.products);
    //for users
    await User.remove({});
    const createdUsers=await User.insertMany(data.users);
    res.send({createdProducts,createdUsers});
});
export default seedRouter;