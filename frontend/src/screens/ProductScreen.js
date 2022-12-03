import React,{useContext, useEffect,useReducer} from 'react'
import {Navigate, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import Rating from '../components/Rating'
import { Helmet } from 'react-helmet-async';
import { getError } from '../utils';
import {Store} from '../Store';
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
        product:action.payload,
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
function ProductScreen() {

  const navigate=useNavigate();

    const params=useParams();
    const {slug}=params;
    const[{loading,product,error},dispatch]=useReducer(reducer,{
      product:[],
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
          const result=await axios.get(`/api/products/slug/${slug}`);
          //if success
          dispatch({type:'FETCH_SUCCESS',payload:result.data});
        }catch(err){
          dispatch({type:'FETCH_FAIL',payload:getError(err)});
        }
       
        //setProducts(result.data);
      };
      fetchData();
    },[slug]);

    const {state,dispatch:ctxDispatch}=useContext(Store);
    //if exist
    const {cart}=state;
    const addToCartHandler=async ()=>{
      const existItem=cart.cartItems.find((x)=>x._id===product._id);
      //if not exist then quantity 1 , but id exist +1
      const quantity=existItem ? existItem.quantity + 1: 1;
      const {data}=await axios.get(`/api/products/${product._id}`);
      if(data.countInStock<quantity){
        window.alert('sorry. Product is out of stock');
        return;
      }
    
      ctxDispatch({type:'CART_ADD_ITEM',payload:{...product,quantity},
    });
    navigate('/cart')
  }; 

    return (
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
          <div className="container">
            <div className="row">
              <div className="col">
                <img src={product.image} className='image' alt={product.name}/>
              </div>
              <div className="col">
                <Helmet><title>{product.name}</title></Helmet>
                <h2 className='title'>{product.name}</h2>
                <p className='category'>{product.category}</p>
                <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                <span>${product.price}</span>
                <hr/>
                <p className="desc">Description:<br/>{product.description}</p>
                <div className="action">
                  <div className="status">
                    <p>Status:{product.countInStock>0 ?(<span className='success'>In Stock</span>
                    ) : (
                      <span className='unavailable'>Unavailable</span>
                    )}</p>
                  </div>
                  <div className="add">
                    {product.countInStock>0 && (
                      <div className="cart">
                        <button onClick={addToCartHandler}>Add to Cart</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
}

export default ProductScreen