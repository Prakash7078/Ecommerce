import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';
dotenv.config();
const app=express()
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log('connect with db');
}).catch((err)=>{
    console.log(err.message);
});
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/seed',seedRouter);


app.use('/api/products',productRouter);

app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes);
app.use((err,req,res,next)=>{
    res.status(500).send({message:err.message});
});
app.use(
    cors({
        origin:["https://localhost:3000","https://my-ecommerce-site.onrender.com"]
    })
);
 const port=process.env.PORT || 5000;
 app.listen(port,()=>{
    console.log(`server running on port: ${port}`);
 });
