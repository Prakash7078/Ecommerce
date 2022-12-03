import React, {useEffect,useReducer } from 'react';
//import data from '../data'
import shopback from './shoppback.jpg'
import axios from 'axios';
import logger from 'use-reducer-logger';
import Product from '../components/Product'
import { Helmet } from 'react-helmet-async';
const reducer=(state,action)=>{
  switch(action.type){
    case 'FETCH_REQUEST':
      return{
        ...state,
        loading:true
      };
    case 'FETCH_SUCCESS':
      return{
        ...state,
        products:action.payload,
        loading:false
      };
    case 'FETCH_FAIL':
        return{
          ...state,
          loading:false,
          error:action.payload,
        };
    default:
      return state;
  }
};
function HomeScreen() {

  const[{loading,products,error},dispatch]=useReducer(logger(reducer),{
    products:[], 
    loading:false,
    error:'',
  });
 // const [products,setProducts]=useState([]);
  useEffect(()=>{
    const fetchData=async()=>{
      //first send request backend for products
      dispatch({type:'FETCH_REQUEST'});
      try{
        //read data from backend
        const result=await axios.get('/api/products');
        //if success
        dispatch({type:'FETCH_SUCCESS',payload:result.data});
      }catch(err){
        dispatch({type:'FETCH_FAIL',payload:err.message});
      }
     
      //setProducts(result.data);
    };
    fetchData();

  },[]);
  return (
    <div>
        <Helmet><title>PNR</title></Helmet>
        <h1 className='newProducts'>New Products</h1>
        <img className="img1"src={shopback} alt="shopping"></img>
        <div className='products'>
          {
          loading?(
            <div>
              <h3 className='message'>Loading...</h3>
            </div>
          ):error?(
            <div>
              <h3 className='message'>{error}</h3>
            </div>
          ):
          products.map((product)=>{
            return(
              <Product key={product.slug} product={product}></Product>
            )
          })}
        </div>
    </div>
  )
}

export default HomeScreen